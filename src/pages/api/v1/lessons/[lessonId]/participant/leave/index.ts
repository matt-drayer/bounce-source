import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import {
  AppPersonasEnum,
  LessonOrderItemsUpdates,
  LessonOrdersUpdates,
  LessonParticipantStatusesEnum,
  LessonStatusesEnum,
  OrderStatusesEnum,
  PaymentFulfillmentChannelsEnum,
} from 'types/generated/server';
import admin from 'services/server/firebase/serverless/admin';
import { getValidViewerFromToken } from 'services/server/firebase/serverless/getValidViewerFromToken';
import { updatePlayerRemoveFromLesson } from 'services/server/graphql/mutations/updatePlayerRemoveFromLesson';
import { updatePlayerRemoveFromLessonAndRefund } from 'services/server/graphql/mutations/updatePlayerRemoveFromLessonAndRefund';
import { getLessonParticipantByLessonIdAndUserId } from 'services/server/graphql/queries/getLessonParticipantByLessonIdAndUserId';
import { triggerLessonAvailableForWaitlistNotification } from 'services/server/notifications/triggerLessonAvailableForWaitlistNotification';
import { adapterParticipantLeftApi } from 'services/server/notifications/triggerLessonAvailableForWaitlistNotification/transformers';
import { triggerParticipantLeftLessonNotification } from 'services/server/notifications/triggerParticipantLeftLessonNotification';
import { refundPaymentIntents } from 'services/server/stripe/refundPaymentIntents';
import { allowCors } from 'utils/server/serverless/http';
import { createErrorObject, response400BadRequestError } from 'utils/server/serverless/http';
import { getIsPlayerCancelRefundable } from 'utils/shared/user/getIsPlayerCancelRefundable';

interface Payload {
  // TODO: This pattern is deprecated. Update client and server to use Authorization: Bearer {token} header.
  token: string;
  lessonId: string;
}

const auth = admin.auth();

const LESSON_ID_NO_MATCH_ERROR = 'Lesson ID in query does match payload';
const USER_NOT_PARTICPANT_ERROR = 'User is not participant';
const NOT_ACTIVE_PARTICIPANT_STATUS_ERROR = 'User is not set as active participant';
const NOT_ACTIVE_LESSON_ERROR = 'This is not an active lesson';
const NO_ORDERS_SUCCEEDED_ERROR = 'No orders available to cancel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      try {
        const payload = req.body as Payload;
        const { lessonId } = req.query;

        if (lessonId !== payload.lessonId) {
          Sentry.captureException(
            new Error(`${LESSON_ID_NO_MATCH_ERROR} | ${lessonId} | ${payload.lessonId}`),
          );
          return response400BadRequestError(res, LESSON_ID_NO_MATCH_ERROR);
        }

        const { userId } = await getValidViewerFromToken(payload.token);
        const participantResponse = await getLessonParticipantByLessonIdAndUserId({
          lessonId,
          userId,
        });
        const participants = participantResponse?.lessonParticipants || [];

        if (participants.length === 0) {
          Sentry.captureException(
            new Error(`${USER_NOT_PARTICPANT_ERROR} | ${userId} | ${lessonId}`),
          );
          return response400BadRequestError(res, USER_NOT_PARTICPANT_ERROR);
        }

        // NOTE: There is a unique key on lesson_id and user_id (2022/09/20), so there should only be one item
        const participant = participants[0];
        const lesson = participant.lesson;
        const orderItems = participant.orderItems;
        const ordersWithSucceededStatus = orderItems.map(
          (orderItem) => orderItem.order.status === OrderStatusesEnum.Succeeded,
        );

        if (participant.status !== LessonParticipantStatusesEnum.Active) {
          Sentry.captureException(
            new Error(
              `${NOT_ACTIVE_PARTICIPANT_STATUS_ERROR}, user ID: ${userId}, lesson ID: ${lessonId}`,
            ),
          );
          return response400BadRequestError(res, NOT_ACTIVE_PARTICIPANT_STATUS_ERROR);
        }
        if (lesson.status !== LessonStatusesEnum.Active) {
          Sentry.captureException(new Error(NOT_ACTIVE_LESSON_ERROR));
          return response400BadRequestError(res, NOT_ACTIVE_LESSON_ERROR);
        }
        if (
          ordersWithSucceededStatus.length === 0 &&
          participant.paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform
        ) {
          Sentry.captureException(new Error(NO_ORDERS_SUCCEEDED_ERROR));
          return response400BadRequestError(res, NO_ORDERS_SUCCEEDED_ERROR);
        }

        const isPlayerCancelRefundable = getIsPlayerCancelRefundable({
          lessonStartDateTime: new Date(lesson.startDateTime),
        });

        // TODO: SHOULD THEY BE ABLE TO REFUND? WHAT IF THEY PAID AND SOMEONE HOW DIDN'T GET REFUNDED AND THIS RETURNED EARLY ABOVE?
        // TODO: SHOULD THEY BE ABLE TO REFUND? WHAT IF THEY PAID AND SOMEONE HOW DIDN'T GET REFUNDED AND THIS RETURNED EARLY ABOVE?
        // TODO: SHOULD THEY BE ABLE TO REFUND? WHAT IF THEY PAID AND SOMEONE HOW DIDN'T GET REFUNDED AND THIS RETURNED EARLY ABOVE?
        // TODO: SHOULD THEY BE ABLE TO REFUND? WHAT IF THEY PAID AND SOMEONE HOW DIDN'T GET REFUNDED AND THIS RETURNED EARLY ABOVE?
        // TODO: SHOULD THEY BE ABLE TO REFUND? WHAT IF THEY PAID AND SOMEONE HOW DIDN'T GET REFUNDED AND THIS RETURNED EARLY ABOVE?

        if (isPlayerCancelRefundable) {
          const refundablePaymentIntents: string[] = [];

          participants.forEach((participant) => {
            participant.orderItems.forEach((orderItem) => {
              if (orderItem.order.status === OrderStatusesEnum.Succeeded) {
                refundablePaymentIntents.push(orderItem.order.externalStripePaymentIntentId);
              }
            });
          });

          await refundPaymentIntents(refundablePaymentIntents);

          const orderItemUpdates: LessonOrderItemsUpdates[] = [];
          const orderUpdates: LessonOrdersUpdates[] = [];

          participant.orderItems.forEach((orderItem) => {
            const order = orderItem.order;
            const orderRefundUnitAmount = order.paidUnitAmount;
            const itemRefundAmount = orderItem.totalUnitAmount;

            orderItemUpdates.push({
              where: {
                id: {
                  _eq: orderItem.id,
                },
              },
              _set: {
                refundUnitAmount: itemRefundAmount,
                status: OrderStatusesEnum.Refunded,
                refundedAt: 'now()',
                refundedByPersona: AppPersonasEnum.Player,
              },
            });

            orderUpdates.push({
              where: {
                id: {
                  _eq: order.id,
                },
              },
              _set: {
                refundUnitAmount: orderRefundUnitAmount,
                status: OrderStatusesEnum.Refunded,
                refundedAt: 'now()',
                refundedByPersona: AppPersonasEnum.Player,
              },
            });
          });

          await updatePlayerRemoveFromLessonAndRefund({
            id: participant.id,
            orderItemUpdates: orderItemUpdates,
            orderUpdates: orderUpdates,
          });
        } else {
          await updatePlayerRemoveFromLesson({
            id: participant.id,
          });
        }

        await Promise.all([
          triggerParticipantLeftLessonNotification({ lessonParticipant: participant }),
          triggerLessonAvailableForWaitlistNotification(adapterParticipantLeftApi({ lesson })),
        ]);

        return res.status(200).json({
          success: true,
        });
      } catch (error) {
        Sentry.captureException(error);
        console.log('--- ERROR = ', error);
        return res.status(500).send(
          createErrorObject({
            message: 'There was an error. Refresh the page and try again.',
            statusCode: 500,
          }),
        );
      }
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Post]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default allowCors(handler);
