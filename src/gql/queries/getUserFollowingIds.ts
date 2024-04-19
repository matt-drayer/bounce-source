import { gql } from '@apollo/client';

export const GET_USER_FOLLOWING_IDS = gql`
  query getUserFollowingIds($followerUserId: uuid!) {
    userFollows(where: { followerUserId: { _eq: $followerUserId }, status: { _eq: ACTIVE } }) {
      status
      followerUserId
      followedUserId
    }
  }
`;
