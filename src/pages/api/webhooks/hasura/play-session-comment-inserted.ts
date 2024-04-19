import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { EventTriggerPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { getPlaySessionFromComment } from 'services/server/graphql/queries/getPlaySessionFromComment';
import { triggerPlaySessionCommentNotification } from 'services/server/notifications/triggerPlaySessionCommentNotification';
import { adapterNewCommentWebhook } from 'services/server/notifications/triggerPlaySessionCommentNotification/transformers';
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

    const body = (await req.json()) as EventTriggerPayload<{ id: string }>;
    const playSessionCommentId = body.event.data.new?.id;
    const playSessionComment = await getPlaySessionFromComment({ id: playSessionCommentId });

    if (!playSessionComment?.playSessionCommentsByPk) {
      return responseJson200Success(req, { success: false });
    }

    await triggerPlaySessionCommentNotification(
      adapterNewCommentWebhook({ playSessionComment: playSessionComment.playSessionCommentsByPk }),
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
