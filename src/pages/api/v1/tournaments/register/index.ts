import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';
import { HttpMethods } from 'constants/http';
import { getCourtPageUrl, getEventUrl } from 'constants/pages';
import { PostRequestPayload } from 'constants/payloads/tournamentsRegister';
import {
  AppPersonasEnum,
  EventGroupRegistrationStatusesEnum,
  EventGroupRegistrationsInsertInput,
  EventInvitationsInsertInput,
  EventTeamMemberStatusesEnum,
  EventTeamMembersConstraint,
  EventTeamMembersUpdateColumn,
  EventTeamsConstraint,
  EventTeamsUpdateColumn,
  EventTransactionItemTypesEnum,
  EventTypesEnum,
  GetEventInvitationByIdQuery,
  GetEventTeamInviteByIdQuery,
  InsertTournamentRegistrationMutationVariables,
  OrderStatusesEnum,
  PaymentProcessorsEnum,
  StripePaymentIntentsConstraint,
  StripePaymentIntentsUpdateColumn,
} from 'types/generated/server';
import { BrevoAttributes, addUserToTournamentList } from 'services/server/brevo';
import {
  sendTournamentPartnerInvite,
  sendTournamentRegistrationEmail,
} from 'services/server/brevo';
import { fetchDuprInfo } from 'services/server/dupr';
import { insertTournamentRegistration } from 'services/server/graphql/mutations/insertTournamentRegistration';
import { insertTournamentTransaction } from 'services/server/graphql/mutations/insertTournamentTransaction';
import { updateAcceptInvitationById } from 'services/server/graphql/mutations/updateAcceptInvitationById';
import { getEventDetails } from 'services/server/graphql/queries/getEventDetails';
import { getEventInvitationById } from 'services/server/graphql/queries/getEventInvitationById';
import { getEventInvitationsByEmail } from 'services/server/graphql/queries/getEventInvitationsByEmail';
import { getEventRegistrationForUser } from 'services/server/graphql/queries/getEventRegistrationForUser';
import { getEventTeamInviteById } from 'services/server/graphql/queries/getEventTeamInviteById';
import { createChargeForTournamentPlayer } from 'services/server/stripe/createChargeForTournamentPlayer';
import { getCustomerIdFromObject } from 'services/server/stripe/getCustomerIdFromObject';
import { getPaymentMethodById } from 'services/server/stripe/getPaymentMethodById';
import {
  response400BadRequestError,
  response401UnauthorizedError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';
import { calculateEventOrderTotal } from 'utils/shared/money/calculateEventOrderTotal';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { getGroupFormatName } from 'utils/shared/sports/getGroupFormatName';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';

/**
 * @todo Need to ensure we always have one so we don't have to go to the default
 */
const DEFAULT_TIMEZONE = 'America/New_York';

export function formatDate({
  date,
  timeZone,
  locale,
}: {
  date: string;
  timeZone?: string;
  locale?: string;
}) {
  const localeForDisplay = getNavigatorLanguage(locale);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  };
  const formatter = new Intl.DateTimeFormat(localeForDisplay, options);

  try {
    const formattedDate = formatter.format(new Date(date));
    return formattedDate;
  } catch (error) {
    console.log('error', error);
    const errorMessage = `Error formatting date ${date}, ${timeZone}, ${locale}: ${error}`;
    Sentry.captureException(errorMessage);
    return '';
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  return responseJson200Success(res, {
    up: Date.now(),
  });
};

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  try {
    const viewer = req.viewer;
    const payload: PostRequestPayload = req.body;

    console.log('payload: ', JSON.stringify(payload, null, 2));

    if (!payload.tournamentId) {
      return response400BadRequestError(res, 'No tournamentId provided.');
    }

    const eventResponse = await getEventDetails({ id: payload.tournamentId });
    const tournament = eventResponse?.eventsByPk;

    if (!tournament) {
      return response400BadRequestError(res, 'No tournament found.');
    }

    if (tournament.type !== EventTypesEnum.Tournament) {
      return response400BadRequestError(res, 'This is not a tournament.');
    }

    const registrationResponse = await getEventRegistrationForUser({
      eventId: payload.tournamentId,
      userId: viewer.id,
    });

    const tournamentRegistration = registrationResponse?.eventRegistrations[0];
    const isFirstTournamentRegistration = !tournamentRegistration;
    const isAddingEventsToPreviousRegistration = !isFirstTournamentRegistration;
    const orderTotal = calculateEventOrderTotal({
      event: tournament,
      registration: payload.groups,
      isFirstTournamentRegistration,
    });
    const doesRequirePayment = !!orderTotal.total;
    console.log('orderTotal', JSON.stringify(orderTotal, null, 2));

    console.log('doesRequirePayment', doesRequirePayment);
    const eventId = payload.tournamentId;
    const userId = viewer.id;
    let receivedInvitationById: GetEventInvitationByIdQuery['eventInvitationsByPk'];
    let receivedTeamById: GetEventTeamInviteByIdQuery['eventTeamsByPk'];
    let transactionId = '';

    const [
      invitationResponse,
      teamInvitationRespones,
      // inviationsByEmailResponse,
    ] = await Promise.all([
      payload.invitationId
        ? getEventInvitationById({ id: payload.invitationId }).catch((e) => {
            Sentry.captureException(e);
            return null;
          })
        : Promise.resolve(null),
      payload.teamId
        ? getEventTeamInviteById({ id: payload.teamId }).catch((e) => {
            Sentry.captureException(e);
            return null;
          })
        : Promise.resolve(null),
      // getEventInvitationsByEmail({
      //   email: viewer.email,
      //   eventId,
      // }).catch((e) => {
      //   Sentry.captureException(e);
      //   return null;
      // }),
    ]);
    receivedInvitationById = invitationResponse?.eventInvitationsByPk;
    receivedTeamById = teamInvitationRespones?.eventTeamsByPk;

    /**
     * @todo Do we just assume that the other user always accepts the invitation or do we need more logic here? Let the organizer or user sort it out?
     */
    // const receivedInvitationsByEmail = inviationsByEmailResponse?.eventInvitations;

    if (doesRequirePayment) {
      if (!payload.providerCardId) {
        const ERROR = 'No payment method';
        Sentry.captureException(new Error(ERROR));
        return response401UnauthorizedError(res, ERROR);
      }

      const stripePaymentMethod = await getPaymentMethodById(payload.providerCardId);
      const stripeCustomerId = getCustomerIdFromObject(stripePaymentMethod);

      if (!stripePaymentMethod) {
        const ERROR = 'No valid payment method';
        Sentry.captureException(new Error(ERROR));
        return response400BadRequestError(res, ERROR);
      }
      if (viewer?.stripeCustomerId !== stripeCustomerId) {
        const ERROR = 'Stripe customer did not match';
        Sentry.captureException(new Error(ERROR));
        return response403ForbiddenError(res, ERROR);
      }

      const stripeMerchantId = tournament.hostUser?.stripeMerchantId;
      const stripeChargeData = {
        tournamentId: payload.tournamentId as string,
        amount: orderTotal.total,
        currency: (tournament.currency || 'usd').toLowerCase(),
        customerId: stripeCustomerId,
        paymentMethodId: stripePaymentMethod.id,
        events: payload.groups.map((group, index) => ({ groupId: group.groupId, index })),
        registrationFee: orderTotal.registrationFee,
        platformFee: orderTotal.processingFee,
        stripeMerchantId,
      };
      console.log('stripe data', JSON.stringify(stripeChargeData, null, 2));
      const paymentIntent = await createChargeForTournamentPlayer(stripeChargeData);

      if (paymentIntent.status !== 'succeeded') {
        console.log('payment error: ', paymentIntent.last_payment_error?.message);
        return response400BadRequestError(res, paymentIntent.last_payment_error?.message as string);
      }

      const transactionResponse = await insertTournamentTransaction({
        object: {
          applicationFeeTotalUnitAmount: orderTotal.processingFee,
          customerApplicationFeeUnitAmount: orderTotal.processingFee,
          externalStripePaymentIntentId: paymentIntent.id,
          orderSubtotalUnitAmount: orderTotal.subtotal,
          orderTotalUnitAmount: orderTotal.total,
          paidUnitAmount: paymentIntent.amount,
          userId: viewer.id,
          eventId,
          paymentIntentInternal: {
            data: {
              amount: paymentIntent.amount,
              amountCapturable: paymentIntent.amount_capturable,
              amountReceived: paymentIntent.amount_received,
              application:
                typeof paymentIntent.application === 'string'
                  ? paymentIntent.application
                  : paymentIntent.application?.id,
              applicationFeeAmount: paymentIntent.application_fee_amount,
              cancellationReason: paymentIntent.cancellation_reason,
              currency: paymentIntent.currency,
              onBehalfOf:
                typeof paymentIntent.on_behalf_of === 'string'
                  ? paymentIntent.on_behalf_of
                  : paymentIntent.on_behalf_of?.id,
              paymentIntentId: paymentIntent.id,
              paymentMethod:
                typeof paymentIntent.payment_method === 'string'
                  ? paymentIntent.payment_method
                  : paymentIntent.payment_method?.id,
              statementDescriptor: paymentIntent.statement_descriptor,
              status: paymentIntent.status,
              stripeCustomerId,
            },
            onConflict: {
              constraint: StripePaymentIntentsConstraint['StripePaymentIntentsPaymentIntentIdKey'],
              updateColumns: [StripePaymentIntentsUpdateColumn['Status']],
            },
          },
          paymentProcessor: PaymentProcessorsEnum.Stripe,
          refundUnitAmount: 0,
          refundedAt: null,
          refundedByPersona: null,
          sellerApplicationFeeUnitAmount: 0, // @todo: set fee if we start charging clubs
          sellerUserId: tournament.hostUser?.id,
          status: OrderStatusesEnum.Succeeded,
          stripeCustomerId: stripeCustomerId,
          stripeMerchantId: stripeMerchantId,
          stripePaymentStatus: paymentIntent.status,
          transferUnitAmount: stripeMerchantId ? orderTotal.subtotal : 0,
        },
      });

      transactionId = transactionResponse.insertEventTransactionsOne?.id;
    }

    const registrationData: InsertTournamentRegistrationMutationVariables = {
      registrationObjects: [],
      groupRegistrationObjects: [],
    };
    const groupRegistrationData: EventGroupRegistrationsInsertInput[] = [];
    const invitations: EventInvitationsInsertInput[] = (payload.groups || [])
      .filter((group) => group?.partnerEmail)
      .map((group) => ({
        id: uuid(),
        invitedByPersona: AppPersonasEnum.Player,
        senderUserId: userId,
        invitationEmail: group.partnerEmail?.toLowerCase(),
        groupId: group.groupId,
        eventId: eventId,
        invitationName: group.partnerName,
      }));

    if (isFirstTournamentRegistration) {
      registrationData.registrationObjects = {
        eventId: payload.tournamentId,
        userId: viewer.id,
        registrationDetails: {
          data: {
            duprId: payload.duprId || null,
          },
        },
        transactionItems: {
          data: transactionId
            ? [
                {
                  transactionId,
                  type: EventTransactionItemTypesEnum.EventRegistration,
                  status: OrderStatusesEnum.Succeeded,
                  priceUnitAmount: orderTotal.registrationFee || 0,
                  totalUnitAmount: orderTotal.registrationFee || 0,
                  refundUnitAmount: 0,
                },
              ]
            : [],
        },
      };
    }

    const invitationIdsToAccept: string[] = [];
    const invitationsToSend: {
      groupId: string;
      groupTitle: string;
      groupStartTime: string;
      inviteEmail: string;
      inviteName: string;
      inviteUrl: string;
    }[] = [];

    payload.groups.forEach((group) => {
      const invitationToSend = invitations.find((i) => i?.groupId === group.groupId);
      const matchingGroup = tournament.groups.find((g) => g.id === group.groupId);
      let matchingTeamId = '';

      if (receivedInvitationById?.groupId === group.groupId) {
        const teamIdFromInvitation = receivedInvitationById?.groupRegistration?.teamId;

        invitationIdsToAccept.push(receivedInvitationById.id);

        if (!matchingTeamId) {
          matchingTeamId = teamIdFromInvitation || '';
        }

        // } else if (receivedInvitationsByEmail) {
        //   const matchingInvitation = receivedInvitationsByEmail.find(
        //     (i) => i.groupId === group.groupId,
        //   );
        //   matchingTeamId = matchingInvitation?.groupRegistration?.teamId;
      } else {
        /**
         * @todo Do an inverse match based on the partner's email they put in to see if someone already exists in the tournament with that email.
         */
      }

      if (matchingGroup) {
        groupRegistrationData.push({
          groupId: group.groupId,
          invitations:
            invitationToSend && !matchingTeamId ? { data: [invitationToSend] } : undefined,
          invitedPartnerEmail: invitationToSend?.invitationEmail?.toLowerCase(),
          invitedPartnerName: invitationToSend?.invitationName,
          status: EventGroupRegistrationStatusesEnum.Active,
          userId: viewer.id,
          ...(matchingTeamId
            ? {
                team: {
                  data: {
                    id: matchingTeamId,
                    groupId: matchingGroup.id,
                    members: {
                      data: [
                        {
                          userId: viewer.id,
                          status: EventTeamMemberStatusesEnum.Active,
                        },
                      ],
                      onConflict: {
                        constraint: EventTeamMembersConstraint['EventTeamMembersTeamIdUserIdKey'],
                        updateColumns: [EventTeamMembersUpdateColumn['Status']],
                      },
                    },
                  },
                  onConflict: {
                    constraint: EventTeamsConstraint['EventTeamsPkey'],
                    updateColumns: [EventTeamsUpdateColumn['UpdatedAt']],
                  },
                },
              }
            : {}),
          ...(!matchingTeamId
            ? {
                team: {
                  data: {
                    id: uuid(),
                    groupId: matchingGroup.id,
                    members: {
                      data: [
                        {
                          userId: viewer.id,
                          status: EventTeamMemberStatusesEnum.Active,
                        },
                      ],
                      onConflict: {
                        constraint: EventTeamMembersConstraint['EventTeamMembersTeamIdUserIdKey'],
                        updateColumns: [EventTeamMembersUpdateColumn['Status']],
                      },
                    },
                  },
                },
              }
            : {}),
          transactionItems: {
            data: transactionId
              ? [
                  {
                    transactionId,
                    type: EventTransactionItemTypesEnum.EventGroupRegistration,
                    status: OrderStatusesEnum.Succeeded,
                    priceUnitAmount: matchingGroup.priceUnitAmount || 0,
                    totalUnitAmount: matchingGroup.priceUnitAmount || 0,
                    refundUnitAmount: 0,
                  },
                ]
              : [],
          },
        });

        const isNewInvitation = invitationToSend && !matchingTeamId;
        const team = groupRegistrationData[groupRegistrationData.length - 1]?.team?.data;
        if (team && isNewInvitation) {
          const teamId = team.id;
          const groupTitle = matchingGroup.title;
          const groupStartTime = matchingGroup.startsAt;
          const invitationId = invitationToSend.id;
          const inviteEmail = invitationToSend.invitationEmail?.toLowerCase();
          const inviteName = invitationToSend.invitationName;
          const inviteUrl = `${process.env.APP_URL}${getEventUrl(
            tournament.id,
          )}?invite=${invitationId}&team=${teamId}`;

          invitationsToSend.push({
            groupId: group.groupId,
            groupTitle,
            groupStartTime,
            inviteEmail: inviteEmail || '',
            inviteName: inviteName || '',
            inviteUrl,
          });
        }
      }
    });

    registrationData.groupRegistrationObjects = groupRegistrationData;

    let duprInfo;

    if (payload.duprId) {
      try {
        duprInfo = await fetchDuprInfo(payload.duprId);
      } catch (e) {
        Sentry.captureException(e);
      }
    }

    console.log('duprInfo', JSON.stringify(duprInfo, null, 2));
    // duprInfo.doubles (rating)
    // duprInfo.singles (rating)
    // duprInfo.firstName
    // duprInfo.lastName
    // duprInfo.fullName
    // duprInfo.duprId
    // duprInfo.age
    // duprInfo.address
    // duprInfo.gender

    // todo:
    // set user's birthday and duprId if they were uploaded
    // do something with the DUPR info? Maybe need a new table for it. Or is it part of the pickleball rating table?
    // do any validity checks on registration vs. what's happening? Anything to do for adding an event vs. registering for tournament and adding event?
    // insert registration for hte tournament and order details

    console.log('registrationData', JSON.stringify(registrationData, null, 2));

    const acceptInvitationMutations = invitationIdsToAccept.map((invitationId) =>
      updateAcceptInvitationById({
        id: invitationId,
        invitedUserId: viewer.id,
      }).catch((e) => Sentry.captureException(e)),
    );

    /**
     * @todo Should this go through the notificatin pipeline?
     * start ------
     */
    const tournamentEmailParams = {
      eventId,
      eventUrl: `${process.env.APP_URL}${getEventUrl(tournament.id)}`,
      eventTitle: tournament.title,
      eventGroupsFormat: getGroupFormatName(
        tournament.groupFormat || tournament.groups[0].format || '',
      ),
      venueTitle: tournament.venue?.title || '',
      venueUrl: tournament.venue?.slug
        ? `${process.env.APP_URL}${getCourtPageUrl(tournament.venue.slug)}`
        : '',
      venueAddress: tournament.venue?.addressString || tournament.addressString || '',
      eventStartDate: formatDate({
        date: tournament.startDateTime,
        timeZone: tournament.timezoneName || tournament.venue?.timezone || DEFAULT_TIMEZONE,
      }),
      eventEndDate: formatDate({
        date: tournament.endDateTime,
        timeZone: tournament.timezoneName || tournament.venue?.timezone || DEFAULT_TIMEZONE,
        locale: tournament.locale,
      }),
    };
    const triggerRegistrationCompleteEmail = sendTournamentRegistrationEmail({
      ...tournamentEmailParams,
      toEmail: viewer.email,
      name: splitNameToFirstLast(viewer.fullName).firstName || 'there',
      groups: payload.groups.map((group) => {
        const matchingGroup = tournament.groups.find((g) => g.id === group.groupId);

        return {
          eventGroupsTitle: matchingGroup?.title || '',
          eventGroupsStartAt: formatDate({
            date: matchingGroup?.startsAt || '',
            timeZone: tournament.timezoneName || DEFAULT_TIMEZONE,
          }),
        };
      }),
    }).catch((e) => {
      console.log('Send registration email error: ', e);
      Sentry.captureException(e);
    });
    const triggerPartnerInvitationEmails = invitationsToSend
      .map((invitation) => {
        return {
          ...tournamentEmailParams,
          toEmail: invitation.inviteEmail?.toLowerCase(),
          name: invitation.inviteName || 'there',
          inviteUrl: invitation.inviteUrl,
          groups: [
            {
              eventGroupsTitle: invitation.groupTitle,
              eventGroupsStartAt: formatDate({
                date: invitation.groupStartTime,
                timeZone: tournament.timezoneName || DEFAULT_TIMEZONE,
              }),
            },
          ],
        };
      })
      .map((params) => {
        return sendTournamentPartnerInvite(params).catch((e) => {
          console.log('Send partner invitation email error: ', e);
          Sentry.captureException(e);
        });
      });
    /**
     * ----- en d
     */
    const emailPromises = [
      triggerRegistrationCompleteEmail,
      ...triggerPartnerInvitationEmails,
      addUserToTournamentList({
        email: viewer.email,
        attributes: {
          [BrevoAttributes.FirstName]: splitNameToFirstLast(viewer.fullName).firstName,
          [BrevoAttributes.LastName]: splitNameToFirstLast(viewer.fullName).lastName,
        },
      }).catch((e) => {
        console.log('Add user to tournament list error: ', e);
        Sentry.captureException(e);
      }),
    ];

    await Promise.all([
      insertTournamentRegistration(registrationData),
      ...acceptInvitationMutations,
      ...emailPromises,
    ]);

    return responseJson200Success(res, {
      success: true,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log('error: ', error);
    return response500ServerError(res, 'There was an error registering for the tournament.');
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
