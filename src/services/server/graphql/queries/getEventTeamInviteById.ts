import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventTeamInviteByIdQuery,
  GetEventTeamInviteByIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventTeamInviteById($id: uuid!) {
    eventTeamsByPk(id: $id) {
      id
      groupId
      members {
        id
        userProfile {
          id
          fullName
          preferredName
          profileImageFileName
          profileImagePath
          profileImageProvider
          profileImageProviderUrl
        }
      }
      groupRegistrations {
        id
        status
      }
    }
  }
`;

export const getEventTeamInviteById = async (variables: GetEventTeamInviteByIdQueryVariables) => {
  const data = await client.request<GetEventTeamInviteByIdQuery>(print(QUERY), variables);
  return data;
};
