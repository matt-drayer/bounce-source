import * as Sentry from '@sentry/nextjs';
import { addMinutes } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import { EventTriggerPayload, WEBHOOK_LESSON_REMINDER_SEND } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { LessonStatusesEnum } from 'types/generated/server';
import { updateLessonReminderEventId } from 'services/server/graphql/mutations/updateLessonReminderEventId';
import { getLessonById } from 'services/server/graphql/queries/getLessonById';
import { createScheduledEvent } from 'services/server/hasura/metadata';
import { allowCors } from 'utils/server/serverless/http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      try {
        const webhookSecret = req.headers['webhook-secret'];

        console.log(1);
        if (webhookSecret !== process.env.HASURA_WEBHOOK_SECRET) {
          console.log(2);
          console.log('!!!! WH SECRET DOES NOT MATCH', webhookSecret);
          Sentry.captureException(new Error('Webhook secret does not match'));
          return res.status(200).send({ success: false });
        }

        const body = req.body as EventTriggerPayload<{ id: string }>;
        const lessonId = body.event.data.new?.id;
        const lessonResponse = await getLessonById({ id: lessonId });
        const lesson = lessonResponse?.lessonsByPk;
        console.log(3);

        if (!lesson) {
          console.log(4);
          throw new Error(`Lesson not found: ${lessonId}`);
        }

        if (
          lesson.startDateTime &&
          !lesson.reminderEventId &&
          lesson.status === LessonStatusesEnum.Active
        ) {
          console.log(5);
          // const eventScheduleTime = addMinutes(new Date(), 2).toISOString();
          const eventScheduleTime = addMinutes(new Date(lesson.startDateTime), -60).toISOString();
          console.log({ eventScheduleTime });
          const scheduleResponse = await createScheduledEvent({
            payload: {
              lessonId: lessonId,
            },
            eventScheduleTime: eventScheduleTime,
            retryConfig: {
              num_retries: 2,
            },
            webhook: WEBHOOK_LESSON_REMINDER_SEND,
          });
          console.log(6, scheduleResponse);
          await updateLessonReminderEventId({
            id: lessonId,
            reminderEventId: scheduleResponse.event_id,
          });
          console.log(7);
        }
      } catch (error) {
        console.log('+++++ ERROR:', error);
        Sentry.captureException(error);
        return res.status(400).json({
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
      });
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Post]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default allowCors(handler);
