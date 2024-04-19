import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { ScheduledEventWebhookPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { PlaySessionStatusesEnum } from 'types/generated/server';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
import { triggerPlaySessionReminderNotification } from 'services/server/notifications/triggerPlaySessionReminderNotification';
import { adapterReminderWebhook } from 'services/server/notifications/triggerPlaySessionReminderNotification/transformers';
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

      const body = req.body as ScheduledEventWebhookPayload<{ playSessionId: string }>;
      const playSessionId = body.payload?.playSessionId;

      console.log(body);
      console.log({ playSessionId });

      if (!playSessionId) {
        console.log('==== END EARLY ====');
        return res.status(500).end('No play session id');
      }

      const playSessionResponse = await getPlaySessionById({ id: playSessionId });
      const playSession = playSessionResponse?.playSessionsByPk;
      console.log(3);

      if (!playSession) {
        console.log(4);
        throw new Error(`Play session not found: ${playSessionId}`);
      }

      if (playSession.status !== PlaySessionStatusesEnum.Active) {
        return res.status(200).json({
          success: true,
        });
      }

      // TODO: Sanity checks around start time and current time?

      await triggerPlaySessionReminderNotification(adapterReminderWebhook({ playSession }));

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
