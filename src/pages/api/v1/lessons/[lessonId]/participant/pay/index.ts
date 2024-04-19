import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import {
  GetLessonByIdQuery,
  LessonStatusesEnum,
  LessonWaitlistStatusesEnum,
  PaymentFulfillmentChannelsEnum,
} from 'types/generated/server';
import admin from 'services/server/firebase/serverless/admin';
import { getBearerToken } from 'services/server/firebase/serverless/getBearerToken';
import { getValidViewerFromToken } from 'services/server/firebase/serverless/getValidViewerFromToken';
import { insertActiveLessonOrder } from 'services/server/graphql/mutations/insertActiveLessonOrder';
import { insertLessonParticipantOffPlatformPayment } from 'services/server/graphql/mutations/insertLessonParticipantOffPlatformPayment';
import { updateUserDefaultCardId } from 'services/server/graphql/mutations/updateUserDefaultCardId';
import { updateUserDefaultSport } from 'services/server/graphql/mutations/updateUserDefaultSport';
import { upsertLessonWaitlist } from 'services/server/graphql/mutations/upsertLessonWaitlist';
import { upsertUserCreditCard } from 'services/server/graphql/mutations/upsertUserCreditCard';
import { getLessonById } from 'services/server/graphql/queries/getLessonById';
import { getViewerById } from 'services/server/graphql/queries/getViewerById';
import { triggerParticipantJoinLessonNotification } from 'services/server/notifications/triggerParticipantJoinLessonNotification';
import { createChargeForLesson } from 'services/server/stripe/createChargeForLesson';
import { getCustomerIdFromObject } from 'services/server/stripe/getCustomerIdFromObject';
import { getPaymentMethodById } from 'services/server/stripe/getPaymentMethodById';
import { allowCors } from 'utils/server/serverless/http';
import {
  response400BadRequestError,
  response401UnauthorizedError,
  response403ForbiddenError,
  response500ServerError,
} from 'utils/server/serverless/http';
import { getIsFulfillmentChannelAllowed } from 'utils/shared/money/getIsFulfillmentChannelAllowed';
import { getLessonItemizedTotal } from 'utils/shared/money/getLessonItemizedTotal';

interface Payload {
  providerCardId?: string;
  paymentFulfillmentChannel?: PaymentFulfillmentChannelsEnum | null;
}

const auth = admin.auth();

// TODO: Pull all ERROR constants below up here and named

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      try {
        const payload = req.body as Payload;
        const lessonId = typeof req.query.lessonId === 'string' ? req.query.lessonId : '';
        const authorizationBearerToken = getBearerToken(req);

        if (!authorizationBearerToken) {
          const ERROR = 'Not logged in';
          Sentry.captureException(new Error(ERROR));
          return response403ForbiddenError(res, ERROR);
        }

        if (!lessonId) {
          const ERROR = 'Invalid lesson ID';
          Sentry.captureException(new Error(ERROR));
          return response401UnauthorizedError(res, ERROR);
        }

        let lesson: GetLessonByIdQuery | undefined;
        let viewer;
        let userId;
        try {
          const token = await getValidViewerFromToken(authorizationBearerToken);
          userId = token.userId;
          [viewer, lesson] = await Promise.all([
            getViewerById(userId),
            getLessonById({ id: lessonId }),
          ]);
          lesson = await getLessonById({ id: lessonId });
        } catch (error) {
          Sentry.captureException(error);
          // @ts-ignore
          return response400BadRequestError(res, error.message);
        }

        if (!viewer) {
          const ERROR = 'Could not find valid user from session';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }

        if (!lesson?.lessonsByPk) {
          const ERROR = 'No matching lesson for ID';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }

        if (
          lesson.lessonsByPk.status !== LessonStatusesEnum.Active ||
          !lesson.lessonsByPk.participantLimit
        ) {
          const ERROR = 'Lesson is not active';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }

        const participantLimit = lesson.lessonsByPk.participantLimit || 0;
        const activeParticipants = lesson.lessonsByPk.participantsAggregate?.aggregate?.count || 0;
        const doesLessonHaveRoom = !activeParticipants || activeParticipants < participantLimit;

        if (!doesLessonHaveRoom) {
          const ERROR = 'Lesson is already full';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }

        if (
          !getIsFulfillmentChannelAllowed({
            paymentFulfillmentChannel: payload.paymentFulfillmentChannel,
            availableChannel: lesson.lessonsByPk?.paymentFulfillmentChannel,
          })
        ) {
          const ERROR = 'Paying coach directly is not available for this lesson';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }
        // TODO: Abstract these paths to separate functions in services
        // Ex. processOffPlatformJoinLesson(...);
        else if (payload.paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OffPlatform) {
          try {
            const insertResponse = await insertLessonParticipantOffPlatformPayment({
              userId,
              lessonId,
            });

            const participantsSubscribed = insertResponse.insertLessonParticipantsOne
              ? [insertResponse.insertLessonParticipantsOne]
              : [];

            try {
              await Promise.all([
                triggerParticipantJoinLessonNotification({
                  participants: participantsSubscribed,
                }),
                updateUserDefaultSport({
                  id: userId,
                  defaultSport: lesson.lessonsByPk.sport,
                }),
              ]);
            } catch (error) {
              Sentry.captureException(error);
            }

            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            Sentry.captureException(error);
            // @ts-ignore
            return response500ServerError(res, error.message);
          }
          // TODO: Abstract these paths to separate functions in services
          // Ex. processOnPlatformJoinLesson(...);
        } else if (
          // NOTE: Assuming !channel means on-platform since this was previously the only payment way.
          // This may need to be updated in the future (27 Nov 2022).
          !payload.paymentFulfillmentChannel ||
          payload.paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform
        ) {
          if (!payload.providerCardId) {
            const ERROR = 'No credit card found';
            Sentry.captureException(new Error(ERROR));
            return response400BadRequestError(res, ERROR);
          }

          const stripePaymentMethod = await getPaymentMethodById(payload.providerCardId);
          const stripeCustomerId = getCustomerIdFromObject(stripePaymentMethod);

          if (!stripePaymentMethod) {
            const ERROR = 'No valid payment method';
            Sentry.captureException(new Error(ERROR));
            return response400BadRequestError(res, ERROR);
          }
          if (viewer.stripeCustomerId !== stripeCustomerId) {
            const ERROR = 'Stripe customer did not match';
            Sentry.captureException(new Error(ERROR));
            return response403ForbiddenError(res, ERROR);
          }
          if (!lesson.lessonsByPk.owner?.stripeMerchantId) {
            const ERROR = 'Coach can not receive payments';
            Sentry.captureException(new Error(ERROR));
            return response401UnauthorizedError(res, ERROR);
          }

          ///
          // TODO: Check if user is already participant? Let them buy again?
          ///

          const {
            customerApplicationFee,
            sellerApplicationFee,
            orderSubtotal,
            orderTotal,
            coachAmountReceived,
            applicationFeeTotal,
          } = getLessonItemizedTotal(lesson.lessonsByPk);

          let newCardResponse;
          try {
            if (stripePaymentMethod.card) {
              newCardResponse = await upsertUserCreditCard({
                userId: userId,
                billingCity: stripePaymentMethod?.billing_details?.address?.city,
                billingCountry: stripePaymentMethod?.billing_details?.address?.country,
                billingEmail: stripePaymentMethod?.billing_details?.email,
                billingLine1: stripePaymentMethod?.billing_details?.address?.line1,
                billingLine2: stripePaymentMethod?.billing_details?.address?.line2,
                billingName: stripePaymentMethod?.billing_details?.name,
                billingPhone: stripePaymentMethod?.billing_details?.phone,
                billingPostalCode: stripePaymentMethod?.billing_details?.address?.postal_code,
                billingState: stripePaymentMethod?.billing_details?.address?.state,
                brand: stripePaymentMethod.card.brand || '',
                country: stripePaymentMethod.card.country,
                expireMonth: stripePaymentMethod.card.exp_month || 0,
                expireYear: stripePaymentMethod.card.exp_year || 0,
                fingerprint: stripePaymentMethod.card.fingerprint,
                funding: stripePaymentMethod.card.funding,
                last4: stripePaymentMethod.card.last4 || '',
                providerCardId: stripePaymentMethod.id,
              });

              if (newCardResponse.insertUserCreditCardsOne?.id) {
                await updateUserDefaultCardId({
                  id: userId,
                  defaultCreditCardId: newCardResponse.insertUserCreditCardsOne?.id,
                });
              }
            }
          } catch (error) {
            Sentry.captureException(error);
          }

          // TODO: Should we insert a pending order / lesson participant?

          const paymentIntent = await createChargeForLesson({
            paymentMethodId: stripePaymentMethod.id,
            customerId: viewer.stripeCustomerId,
            amountTotal: orderTotal,
            amountTransfer: coachAmountReceived,
            applicationFee: applicationFeeTotal,
            currency: lesson.lessonsByPk.currency.toLowerCase(),
            stripeMerchantId: lesson.lessonsByPk.owner?.stripeMerchantId,
            lessonId: lesson.lessonsByPk.id,
          });

          if (paymentIntent.status === 'succeeded') {
            // if (lesson.lessonsByPk.priceUnitAmount !== paymentIntent.amount_received) {
            //   // TODO: How to handle this? Probably should never happen...
            // }

            const stripeCharge = (paymentIntent as any).charges.data[0];

            const insertResponse = await insertActiveLessonOrder({
              lessonId: lesson.lessonsByPk.id,
              userId: userId,
              customerUserId: userId,
              customerApplicationFeeUnitAmount: customerApplicationFee,
              sellerApplicationFeeUnitAmount: sellerApplicationFee,
              applicationFeeTotalUnitAmount: applicationFeeTotal,
              externalStripePaymentIntentId: paymentIntent.id,
              orderSubtotalUnitAmount: orderSubtotal,
              orderTotalUnitAmount: orderTotal,
              transferUnitAmount: coachAmountReceived,
              itemPriceUnitAmount: lesson.lessonsByPk.priceUnitAmount,
              itemTotalUnitAmount: lesson.lessonsByPk.priceUnitAmount,
              paidUnitAmount: paymentIntent.amount_received,
              sellerUserId: lesson.lessonsByPk.owner.id,
              stripeCustomerId: viewer.stripeCustomerId,
              stripeMerchantId: lesson.lessonsByPk.owner?.stripeMerchantId,
              stripePaymentStatus: paymentIntent.status,
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
              paymentIntentStatus: paymentIntent.status,
              paymentIntentStripeCustomerId:
                typeof paymentIntent.customer === 'string'
                  ? paymentIntent.customer
                  : paymentIntent.customer?.id || '',
              transferDataAmount: paymentIntent.transfer_data?.amount,
              transferDataDestination:
                typeof paymentIntent.transfer_data?.destination === 'string'
                  ? paymentIntent.transfer_data?.destination
                  : paymentIntent.transfer_data?.destination?.id || '',
              transferGroup: paymentIntent.transfer_group,
              transferId:
                typeof stripeCharge.transfer === 'string'
                  ? stripeCharge.transfer
                  : stripeCharge.transfer?.id || '',
              sourceTransfer:
                typeof stripeCharge.source_transfer === 'string'
                  ? stripeCharge.source_transfer
                  : stripeCharge.source_transfer?.id || '',
              chargeAmount: stripeCharge.amount,
              amountCaptured: stripeCharge.amount_captured,
              amountRefunded: stripeCharge.amount_refunded,
              chargeApplication:
                typeof stripeCharge.application === 'string'
                  ? stripeCharge.application
                  : stripeCharge.application?.id || '',
              chargeApplicationFee:
                typeof stripeCharge.application_fee === 'string'
                  ? stripeCharge.application_fee
                  : stripeCharge.application_fee?.id || '',
              chargeApplicationFeeAmount: stripeCharge.application_fee_amount,
              calculatedStatementDescriptor: stripeCharge.calculated_statement_descriptor,
              captured: stripeCharge.captured,
              chargeId: stripeCharge.id,
              chargeCurrency: stripeCharge.currency,
              disputed: stripeCharge.disputed,
              chargeExternalStripePaymentIntentId:
                typeof stripeCharge.payment_intent === 'string'
                  ? stripeCharge.payment_intent
                  : stripeCharge.payment_intent?.id || '',
              chargePaid: stripeCharge.paid,
              chargePaymentMethod: stripeCharge.payment_method,
              refunded: stripeCharge.refunded,
              chargeStripeCustomerId:
                typeof stripeCharge.customer === 'string'
                  ? stripeCharge.customer
                  : stripeCharge.customer?.id || '',
              userCreditCardId: newCardResponse?.insertUserCreditCardsOne?.id || null,
            });

            const participantsSubscribed = insertResponse.insertLessonOrdersOne?.items
              ? insertResponse.insertLessonOrdersOne?.items.map((item) => item.lessonParticipant)
              : [];

            try {
              await Promise.all([
                triggerParticipantJoinLessonNotification({
                  participants: participantsSubscribed,
                }),
                updateUserDefaultSport({
                  id: userId,
                  defaultSport: lesson.lessonsByPk.sport,
                }),
                upsertLessonWaitlist({
                  objects:
                    insertResponse.insertLessonOrdersOne?.items.map((item) => ({
                      userId: item.lessonParticipant.userId,
                      lessonId: lesson?.lessonsByPk?.id,
                      status: LessonWaitlistStatusesEnum.Inactive,
                    })) || [],
                }),
              ]);
            } catch (error) {
              Sentry.captureException(error);
            }

            return res.status(200).json({
              success: true,
            });
          } else {
            const ERROR = 'Could not complete payment';
            Sentry.captureException(new Error(ERROR));
            return response400BadRequestError(res, ERROR);
          }
        } else {
          const ERROR = 'Invalid payment option';
          Sentry.captureException(new Error(ERROR));
          return response400BadRequestError(res, ERROR);
        }
      } catch (error) {
        Sentry.captureException(error);
        console.log('--- ERROR = ', error);
        return response500ServerError(res, 'There was an error. Refresh the page and try again.');
      }
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Post]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default allowCors(handler);
