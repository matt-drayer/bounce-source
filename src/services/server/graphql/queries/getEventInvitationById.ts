import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventInvitationByIdQuery,
  GetEventInvitationByIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventInvitationById($id: uuid!) {
    eventInvitationsByPk(id: $id) {
      eventId
      groupId
      id
      senderUserId
      groupRegistrationId
      groupRegistration {
        id
        teamId
      }
    }
  }
`;

export const getEventInvitationById = async (variables: GetEventInvitationByIdQueryVariables) => {
  const data = await client.request<GetEventInvitationByIdQuery>(print(QUERY), variables);
  return data;
};
