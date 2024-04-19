import { gql } from '@apollo/client';

export const GET_GROUP_MEMBERS = gql`
  query getGroupMembers($id: uuid!) {
    groupsByPk(id: $id) {
      id
      members {
        userProfile {
          id
          preferredName
          fullName
          profileImagePath
          username
        }
      }
    }
  }
`;
