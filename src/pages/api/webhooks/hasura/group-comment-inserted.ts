import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { EventTriggerPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { getGroupThreadFromComment } from 'services/server/graphql/queries/getGroupThreadFromComment';
import { triggerGroupCommentReplyNotification } from 'services/server/notifications/triggerGroupCommentReplyNotification';
import { adapterInsertCommentWebhook } from 'services/server/notifications/triggerGroupCommentReplyNotification/transformers';
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

    const body = (await req.json()) as EventTriggerPayload<{ groupThreadId: string }>;
    const groupThreadId = body.event.data.new?.groupThreadId;
    const groupThread = await getGroupThreadFromComment({ id: groupThreadId });

    if (!groupThread?.groupThreadCommentsByPk) {
      Sentry.captureException(new Error('No group thread found to send notification'));
      return responseJson200Success(req, {
        success: false,
      });
    }

    const isOriginalComment = groupThread.groupThreadCommentsByPk.isOriginalThreadComment;

    if (isOriginalComment) {
      return responseJson200Success(req, {
        success: false,
      });
    }

    // A thread that you participated in from your group <name> received a new comment. new comment: ... \n original comment: ...

    await triggerGroupCommentReplyNotification(
      adapterInsertCommentWebhook({ newComment: groupThread.groupThreadCommentsByPk }),
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
