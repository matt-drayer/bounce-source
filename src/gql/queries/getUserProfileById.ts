import { gql } from '@apollo/client';

export const GET_USER_PROFILE_BY_ID = gql`
  query getUserProfileById($id: uuid!) {
    userProfiles(where: { id: { _eq: $id } }) {
      ...userProfileFields
    }
  }
`;
