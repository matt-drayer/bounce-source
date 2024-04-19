import { gql } from '@apollo/client';

export const GET_USER_FOLLOWER_PROFILES = gql`
  query getUserFollowerProfiles($followedUserId: uuid!) {
    userFollows(where: { followedUserId: { _eq: $followedUserId }, status: { _eq: ACTIVE } }) {
      status
      followerUserId
      followedUserId
      followerProfile {
        id
        preferredName
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        fullName
        username
      }
    }
  }
`;
