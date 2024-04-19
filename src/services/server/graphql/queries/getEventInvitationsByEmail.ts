import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventInvitationsByEmailQuery,
  GetEventInvitationsByEmailQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventInvitationsByEmail($email: String!, $eventId: uuid!) {
    eventInvitations(where: { invitationEmail: { _eq: $email }, eventId: { _eq: $eventId } }) {
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

export const getEventInvitationsByEmail = async (
  variables: GetEventInvitationsByEmailQueryVariables,
) => {
  const data = await client.request<GetEventInvitationsByEmailQuery>(print(QUERY), variables);
  return data;
};
