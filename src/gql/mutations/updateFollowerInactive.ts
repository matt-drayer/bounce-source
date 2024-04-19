import { gql } from '@apollo/client';

export const UPDATE_FOLLOWER_INACTIVE = gql`
  mutation updateFollowerInactive($followedUserId: uuid!, $followerUserId: uuid!) {
    updateUserFollows(
      where: { followedUserId: { _eq: $followedUserId }, followerUserId: { _eq: $followerUserId } }
      _set: { status: INACTIVE }
    ) {
      returning {
        followerUserId
        followedUserId
        status
      }
    }
  }
`;
