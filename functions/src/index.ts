import * as Sentry from '@sentry/serverless';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { v4 as uuid } from 'uuid';
import PostHogClient from './services/analytics/posthog';
import { addUserEmailToProvider, sendWelcomeEmail } from './services/brevo';
import { COACH_TYPE, VALID_SIGNUP_REQUEST_TIMEOUT } from './services/constants';
import { getIsValidUsernameFormat } from './services/getIsValidUsernameFormat';
import insertUser from './services/graphql/mutations/insertUser';
import insertUserCommunicationPreferences from './services/graphql/mutations/insertUserCommunicationPreferences';

/**
 * @note doing on initial user insert
 */
// import upadateUsername from './services/graphql/mutations/updateUsername';
// I would also like to insertUserCommunicationPreferences but there seems to be some error with the PK being a FK and user's id
import checkUsernameAvailability from './services/graphql/queries/checkUsernameAvailability';
import getRecentSignupRequest from './services/graphql/queries/getRecentSignupRequest';
import createStripeUser from './services/stripe/createStripeUser';
import { CoachStatusEnum, EventOrganizerAccountTypesEnum } from './services/types/generated';

Sentry.GCPFunction.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

exports.processSignUp = Sentry.GCPFunction.wrapEventFunction(
  functions.auth.user().onCreate(async (user) => {
    const IS_CUSTOM_USERNAMES_ENABLED = false;
    let userId = uuid();
    let username = null;
    let insertedUserData = null;
    let preferredName = '';
    let shouldSendStandardWelcomeEmail = false;
    let shouldPreventWelcomeEmail = false;

    try {
      const stripeUser = await createStripeUser({ firebaseId: user.uid, email: user.email! });
      // GET SIGN UP REQUEST AND MAKE CHANGES IF NEEDED
      // - Validate username (and insert after so it doesn't fail for whatever reason and make them enter again later)

      const signupRequestResponse = await getRecentSignupRequest({ email: user.email || '' });
      const signupRequest = signupRequestResponse?.signupRequests?.[0];
      const welcomeEmailConfiguruation = signupRequestResponse?.welcomeEmailConfiguration?.[0];
      const hasWelcomeEmailConfig = !!welcomeEmailConfiguruation;
      shouldSendStandardWelcomeEmail = !hasWelcomeEmailConfig;
      shouldPreventWelcomeEmail =
        hasWelcomeEmailConfig &&
        (!welcomeEmailConfiguruation?.template || welcomeEmailConfiguruation?.template === 'NONE');
      let isValidRequestTime = false;

      if (signupRequest.createdAt) {
        isValidRequestTime =
          Date.now() - new Date(signupRequest.createdAt).getTime() <= VALID_SIGNUP_REQUEST_TIMEOUT;
      }

      if (IS_CUSTOM_USERNAMES_ENABLED) {
        username = (isValidRequestTime ? signupRequest?.username : userId).toLowerCase().trim();
      } else {
        username = userId;
      }

      const uploadUsername = username;

      if (uploadUsername && IS_CUSTOM_USERNAMES_ENABLED) {
        const availabilityRespone = await checkUsernameAvailability({ username: uploadUsername });

        if (
          username &&
          getIsValidUsernameFormat(uploadUsername) &&
          !availabilityRespone?.usernamesClaimed?.length &&
          !availabilityRespone?.usernamesActive?.length
        ) {
          // await upadateUsername({ id: userId, username: uploadUsername });
          username = uploadUsername || null;
        }
      }

      const fullName = isValidRequestTime ? signupRequest?.fullName : '';
      preferredName = isValidRequestTime ? signupRequest?.preferredName : '';
      const ipResponse = isValidRequestTime ? signupRequest?.fullDetails : {};
      const coachStatus =
        isValidRequestTime && signupRequest?.accountType === COACH_TYPE
          ? CoachStatusEnum.Active
          : CoachStatusEnum.None;

      const claimData = username ? [{ username, reason: 'USER' }] : [];
      const logData = username ? [{ currentUsername: username, action: 'ADD' }] : [];

      const insertedUser = await insertUser({
        id: userId,
        username,
        firebaseId: user.uid,
        email: user.email!,
        stripeCustomerId: stripeUser.id,
        latestAuthProvider: user.providerData[0].providerId,
        originalAuthProvider: user.providerData[0].providerId,
        fullName: fullName || user.displayName || '',
        preferredName: preferredName || user.displayName?.split(' ')[0] || '',
        coachStatus: coachStatus,
        identityData: user.providerData.map((d) => ({
          email: d.email,
          provider: d.providerId,
          phoneNumber: d.phoneNumber,
          displayName: d.displayName,
        })),
        city: signupRequest?.city || '',
        country: signupRequest?.country || '',
        ip: signupRequest?.ip || '',
        platform: signupRequest?.platform || '',
        region: signupRequest?.region || '',
        timezone: signupRequest?.timezone || '',
        zip: signupRequest?.zip || '',
        fullDetails: ipResponse || null,
        claimData,
        logData,
        latitude: signupRequest?.latitude || null,
        longitude: signupRequest?.longitude || null,
        activeCityId: signupRequest?.cityId || null,
        phoneNumber: signupRequest?.phoneNumber || null,
        eventOrganizerAccountType:
          signupRequest?.eventOrganizerAccountType || EventOrganizerAccountTypesEnum.Inactive,
        geometry:
          signupRequest?.latitude && signupRequest?.longitude
            ? { type: 'Point', coordinates: [signupRequest?.longitude, signupRequest?.latitude] }
            : null,
      });
      await insertUserCommunicationPreferences({
        id: userId,
      });

      functions.logger.log(insertedUser);
      userId = insertedUser?.insertUsersOne?.id;
      insertedUserData = insertedUser?.insertUsersOne;

      if (insertedUserData) {
        try {
          const posthog = PostHogClient();
          posthog.capture({
            distinctId: insertedUserData.id,
            event: 'create_account',
            properties: {
              authProvider: user.providerData[0].providerId,
              authCity: insertedUserData.activeCity?.name || undefined,
              authRegion: insertedUserData.activeCity?.countrySubdivision?.name || undefined,
              authLatitude: insertedUserData.latitude || undefined,
              authLongitude: insertedUserData.longitude || undefined,
              authPlatform: signupRequest?.platform || undefined,
              $set: {
                name: insertedUserData.fullName,
                email: insertedUserData.email,
                city: insertedUserData.activeCity?.name || undefined,
                region: insertedUserData.activeCity?.countrySubdivision?.name || undefined,
                latitude: insertedUserData.latitude || undefined,
                longitude: insertedUserData.longitude || undefined,
                firebaseId: user.uid,
                authProvider: user.providerData[0].providerId,
                stripeCustomerId: insertedUserData.stripeCustomerId,
                username: username,
                createdAt: insertedUserData.createdAt,
                coachStatus: coachStatus,
                authPlatform: signupRequest?.platform || undefined,
                zip: signupRequest?.zip || undefined,
                timezone: signupRequest?.timezone || undefined,
                eventOrganizerAccountType: insertedUserData.eventOrganizerAccountType,
                phoneNumber: insertedUserData.phoneNumber,
              },
            },
          });
          await posthog.shutdownAsync();
        } catch (error) {
          Sentry.captureException(error);
        }
      }
    } catch (error) {
      functions.logger.log('--- ERROR = ', error);
      // @ts-ignore this should exist
      Sentry.captureException(error);
    }

    addUserEmailToProvider(user.email!)
      .catch((error) => {
        functions.logger.log('--- ERROR = ', error);
        Sentry.captureException(error);
      })
      .catch((e) => Sentry.captureException(e));

    if (shouldSendStandardWelcomeEmail && !shouldPreventWelcomeEmail) {
      sendWelcomeEmail(user.email!, preferredName || user.displayName?.split(' ')[0] || '').catch(
        (e) => Sentry.captureException(e),
      );
    }

    const customClaims = {
      userId: userId,
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': 'user',
        'x-hasura-allowed-roles': ['user', 'anonymous'],
        'x-hasura-user-id': userId,
        'x-hasura-subscriptions': '{}',
      },
    };

    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref('metadata/' + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: Date.now() });
      })
      .catch((error) => {
        functions.logger.log('--- ERROR = ', error);
        // @ts-ignore this should exist
        Sentry.captureException(error);
      });
  }),
);
