import { gql } from '@apollo/client';

export const GET_GROUP_BY_ACCESS_CODE = gql`
  query getGroupByAccessCode($accessCode: String!) {
    groups(where: { accessCode: { _eq: $accessCode } }) {
      id
      accessCode
      headline
      title
      city {
        id
        name
      }
      ownerUserProfile {
        fullName
        id
      }
    }
  }
`;
