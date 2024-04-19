import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { EventTriggerPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { CommentVoteEnum, GroupCommentVotes } from 'types/generated/server';
import { getGroupThreadFromUpvote } from 'services/server/graphql/queries/getGroupThreadFromUpvote';
import { triggerGroupCommentUpvoteNotification } from 'services/server/notifications/triggerGroupCommentUpvoteNotification';
import { adapterInsertVoteWebhook } from 'services/server/notifications/triggerGroupCommentUpvoteNotification/transformers';
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

    const body = (await req.json()) as EventTriggerPayload<GroupCommentVotes>;
    const groupCommentVoteId = body.event.data.new?.id;

    if (!body.event.data.new) {
      return responseJson200Success(req, { success: false });
    }

    const isFirstComment = !body.event.data.old;
    if (!isFirstComment) {
      // Not a new comment, don't alert
      return responseJson200Success(req, { success: false, stage: 1 });
    }

    if (body.event.data.new.vote !== CommentVoteEnum.Positive) {
      // Must be positive to notify
      return responseJson200Success(req, { success: false, stage: 2 });
    }

    const groupCommentVote = await getGroupThreadFromUpvote({ id: groupCommentVoteId });

    if (!groupCommentVote?.groupCommentVotesByPk) {
      return responseJson200Success(req, { success: false, stage: 3 });
    }

    if (
      groupCommentVote.groupCommentVotesByPk.userId ===
      groupCommentVote.groupCommentVotesByPk.comment?.user?.id
    ) {
      return responseJson200Success(req, { success: false, stage: 4 });
    }

    await triggerGroupCommentUpvoteNotification(
      adapterInsertVoteWebhook({
        vote: groupCommentVote.groupCommentVotesByPk,
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
