import { gql } from '@apollo/client';

export const UPSERT_FOLLOWER_CONNECTION = gql`
  mutation upsertFollowerConnection(
    $followedUserId: uuid!
    $followerUserId: uuid!
    $status: FollowStatusesEnum!
  ) {
    insertUserFollowsOne(
      object: { followedUserId: $followedUserId, followerUserId: $followerUserId, status: $status }
      onConflict: {
        constraint: user_follows_followed_user_id_follower_user_id_key
        updateColumns: status
      }
    ) {
      followerUserId
      followedUserId
      status
    }
  }
`;
