import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import {
  AppPersonasEnum,
  LessonOrderItemsUpdates,
  LessonOrdersUpdates,
  LessonParticipantStatusesEnum,
  LessonParticipantsUpdates,
  LessonStatusesEnum,
  OrderStatusesEnum,
} from 'types/generated/server';
import admin from 'services/server/firebase/serverless/admin';
import { getValidViewerFromToken } from 'services/server/firebase/serverless/getValidViewerFromToken';
import { updateLessonAsCanceledAndRefunded } from 'services/server/graphql/mutations/updateLessonAsCanceledAndRefunded';
import { getLessonWithParticipantsById } from 'services/server/graphql/queries/getLessonWithParticipantsById';
import { triggerLessonCanceledNotification } from 'services/server/notifications/triggerLessonCanceledNotification';
import { refundPaymentIntents } from 'services/server/stripe/refundPaymentIntents';
import { allowCors } from 'utils/server/serverless/http';
import {
  createErrorObject,
  response400BadRequestError,
  response403ForbiddenError,
} from 'utils/server/serverless/http';

interface Payload {
  // TODO: This pattern is deprecated. Update client and server to use Authorization: Bearer {token} header.
  token: string;
  lessonId: string;
}

const auth = admin.auth();

const LESSON_ID_NO_MATCH_ERROR = 'Lesson ID in query does match payload';
const NO_LESSON_ERROR = 'Lesson not found for ID';
const LESSON_NOT_ACTIVE_ERROR = 'You can only canel a lesson that is active';
const VIEWER_IS_NOT_OWNER = 'Only the owner can cancel the lesson';

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

        const [{ userId }, lessonResponse] = await Promise.all([
          getValidViewerFromToken(payload.token),
          getLessonWithParticipantsById({ id: lessonId }),
        ]);
        const lesson = lessonResponse.lessonsByPk;

        /**
          Checking for request errors: If the lesson exists, if the lesson is active,
          and if the viewer is the owner of the lesson.
        **/
        if (!lesson) {
          Sentry.captureException(new Error(NO_LESSON_ERROR));
          return response400BadRequestError(res, NO_LESSON_ERROR);
        }
        if (lesson.status !== LessonStatusesEnum.Active) {
          Sentry.captureException(new Error(LESSON_NOT_ACTIVE_ERROR));
          return response400BadRequestError(res, LESSON_NOT_ACTIVE_ERROR);
        }
        if (userId !== lesson.ownerUserId) {
          Sentry.captureException(new Error(VIEWER_IS_NOT_OWNER));
          return response403ForbiddenError(res, VIEWER_IS_NOT_OWNER);
        }

        let paymentIntentIds: string[] = [];
        lesson.participants.forEach((participant) => {
          participant.orderItems.forEach((orderItem) => {
            if (orderItem.status === OrderStatusesEnum.Succeeded) {
              paymentIntentIds.push(orderItem.order.paymentIntentInternal.paymentIntentId);
            }
          });
        });

        // NOTE: Is it possible for this lambda to timeout at 1 minute for large groups?
        await refundPaymentIntents(paymentIntentIds);

        const participantUpdates: LessonParticipantsUpdates[] = [];
        const orderItemUpdates: LessonOrderItemsUpdates[] = [];
        const orderUpdates: LessonOrdersUpdates[] = [];

        lesson.participants.forEach((participant) => {
          participantUpdates.push({
            where: {
              id: {
                _eq: participant.id,
              },
            },
            _set: {
              refundedByPersona: AppPersonasEnum.Coach,
              refundedAt: 'now()',
              status: LessonParticipantStatusesEnum.Inactive,
            },
          });

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
                refundedByPersona: AppPersonasEnum.Coach,
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
                refundedByPersona: AppPersonasEnum.Coach,
              },
            });
          });
        });

        await updateLessonAsCanceledAndRefunded({
          lessonId: lessonId,
          participantUpdates: participantUpdates,
          orderItemUpdates: orderItemUpdates,
          orderUpdates: orderUpdates,
        });

        await triggerLessonCanceledNotification({ lesson });

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
