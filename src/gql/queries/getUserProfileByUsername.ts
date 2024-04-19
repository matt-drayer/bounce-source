import { gql } from '@apollo/client';
import { USER_PROFILE_FIELDS } from 'gql/fragments/userProfileFields';

export const GET_USER_PROFILE_BY_USERNAME = gql`
  query getUserProfileByUsername($username: String!, $viewerId: uuid!) {
    userProfiles(where: { username: { _eq: $username } }) {
      ...userProfileFields
    }
    userFollows(
      where: {
        followedProfile: { username: { _eq: $username } }
        followerUserId: { _eq: $viewerId }
      }
    ) {
      status
      followedUserId
      followerUserId
    }
  }
  ${USER_PROFILE_FIELDS}
`;

export const GET_USER_PUBLIB_PROFILE_BY_USERNAME = gql`
  query getUserPublicProfileByUsername($username: String!) {
    userProfiles(where: { username: { _eq: $username } }) {
      ...userProfileFields
    }
  }
  ${USER_PROFILE_FIELDS}
`;
