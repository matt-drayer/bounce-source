import { gql } from '@apollo/client';

export const UPSERT_GROUP_THREAD_VOTE = gql`
  mutation upsertGroupThreadVote(
    $groupThreadCommentId: uuid!
    $userId: uuid!
    $vote: CommentVoteEnum!
  ) {
    insertGroupCommentVotesOne(
      object: { groupThreadCommentId: $groupThreadCommentId, userId: $userId, vote: $vote }
      onConflict: {
        constraint: group_comment_votes_group_thread_comment_id_user_id_key
        updateColumns: vote
      }
    ) {
      id
      userId
      groupThreadCommentId
      vote
    }
  }
`;
