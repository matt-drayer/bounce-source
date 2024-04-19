import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import { EventTriggerPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { PlaySessions } from 'types/generated/server';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
import { triggerPlaySessionDetailsUpdatedNotification } from 'services/server/notifications/triggerPlaySessionDetailsUpdatedNotification';
import { adapterUpdateWebhook } from 'services/server/notifications/triggerPlaySessionDetailsUpdatedNotification/transformers';
import { response500ServerError, responseJson200Success } from 'utils/server/edge/http';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';

export const config = {
  runtime: 'edge',
};

const POST = async (req: NextRequest) => {
  try {
    const webhookSecret = req.headers.get('webhook-secret');

    console.log(1);
    if (webhookSecret !== process.env.HASURA_WEBHOOK_SECRET) {
      console.log(2);
      console.log('!!!! WH SECRET DOES NOT MATCH', webhookSecret);
      Sentry.captureException(new Error('Webhook secret does not match'));
      return responseJson200Success(req, { success: false });
    }

    const body = (await req.json()) as EventTriggerPayload<PlaySessions>;
    const playSessionId = body.event.data.new?.id;
    const changedKeyInformation = {
      startDateTime: false,
      location: false,
    };

    if (!body.event.data.old || !body.event.data.new) {
      return responseJson200Success(req, {
        success: true,
      });
    }

    if (body.event.data.old.startDateTime !== body.event.data.new.startDateTime) {
      changedKeyInformation.startDateTime = true;
    }
    if (body.event.data.old.venueId !== body.event.data.new.venueId) {
      changedKeyInformation.location = true;
    }

    const isNoKeyInformationChanged = Object.values(changedKeyInformation).every(
      (isChange) => !isChange,
    );

    if (isNoKeyInformationChanged) {
      return responseJson200Success(req, {
        success: true,
      });
    }

    const playSessionResponse = await getPlaySessionById({ id: playSessionId });

    if (!playSessionResponse?.playSessionsByPk) {
      return responseJson200Success(req, {
        success: false,
      });
    }

    await triggerPlaySessionDetailsUpdatedNotification(
      adapterUpdateWebhook({
        playSession: playSessionResponse.playSessionsByPk,
        updatedKeyFields: changedKeyInformation,
      }),
    );

    return responseJson200Success(req, {
      success: true,
    });
  } catch (error) {
    const date = new Date().toISOString();
    console.log('+++++ ERROR:', error);
    Sentry.captureException(error);
    return response500ServerError(req, 'There was an error processing the webhook at ' + date);
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
