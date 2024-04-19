import * as Sentry from '@sentry/nextjs';
import { addMinutes } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import { EventTriggerPayload, WEBHOOK_PLAY_SESSION_REMINDER_SEND } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { PlaySessionStatusesEnum } from 'types/generated/server';
import { updatePlaySessionReminderEventId } from 'services/server/graphql/mutations/updatePlaySessionReminderEventId';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
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
        const playSessionId = body.event.data.new?.id;
        const playSessionResponse = await getPlaySessionById({ id: playSessionId });
        const playSession = playSessionResponse?.playSessionsByPk;
        console.log(3, body.event.data);
        console.log(3, playSessionId);
        console.log(3, playSession);

        if (!playSession) {
          console.log(4);
          throw new Error(`Play session not found: ${playSessionId}`);
        }

        if (
          playSession.startDateTime &&
          !playSession.reminderEventId &&
          playSession.status === PlaySessionStatusesEnum.Active
        ) {
          console.log(5);
          // const eventScheduleTime = addMinutes(new Date(), 2).toISOString();
          const eventScheduleTime = addMinutes(
            new Date(playSession.startDateTime),
            -60,
          ).toISOString();
          console.log({ eventScheduleTime });
          const scheduleResponse = await createScheduledEvent({
            payload: {
              playSessionId: playSessionId,
            },
            eventScheduleTime: eventScheduleTime,
            retryConfig: {
              num_retries: 2,
            },
            webhook: WEBHOOK_PLAY_SESSION_REMINDER_SEND,
          });
          console.log(6, scheduleResponse);
          await updatePlaySessionReminderEventId({
            id: playSessionId,
            reminderEventId: scheduleResponse.event_id,
          });
          console.log(7);
        } else {
          console.log(8);
          console.log(
            '+++++ NO ACTION +++++',
            playSession.startDateTime,
            playSession.reminderEventId,
            playSession.status,
          );
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
