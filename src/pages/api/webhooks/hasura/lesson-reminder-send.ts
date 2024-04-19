import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { ScheduledEventWebhookPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { LessonStatusesEnum } from 'types/generated/server';
import { getLessonWithParticipantsById } from 'services/server/graphql/queries/getLessonWithParticipantsById';
import { triggerLessonReminderNotification } from 'services/server/notifications/triggerLessonReminderNotification';
import { allowCors } from 'utils/server/serverless/http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      console.log('send body:', JSON.stringify(req.body));
      console.log('send headers', JSON.stringify(req.headers));

      const webhookSecret = req.headers['webhook-secret'];

      console.log(1);
      if (webhookSecret !== process.env.HASURA_WEBHOOK_SECRET) {
        console.log(2);
        console.log('!!!! WH SECRET DOES NOT MATCH', webhookSecret);
        Sentry.captureException(new Error('Webhook secret does not match'));
        return res.status(200).send({ success: false });
      }

      const body = req.body as ScheduledEventWebhookPayload<{ lessonId: string }>;
      const lessonId = body.payload?.lessonId;
      const lessonResponse = await getLessonWithParticipantsById({ id: lessonId });
      const lesson = lessonResponse?.lessonsByPk;
      console.log(3);

      if (!lesson) {
        console.log(4);
        throw new Error(`Lesson not found: ${lessonId}`);
      }

      if (lesson.status !== LessonStatusesEnum.Active) {
        return res.status(200).json({
          success: true,
        });
      }

      // TODO: Sanity checks around start time and current time?

      await triggerLessonReminderNotification({ lesson });

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
