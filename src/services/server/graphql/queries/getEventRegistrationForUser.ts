import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventRegistrationForUserQuery,
  GetEventRegistrationForUserQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventRegistrationForUser($eventId: uuid!, $userId: uuid!) {
    eventRegistrations(where: { eventId: { _eq: $eventId }, userId: { _eq: $userId } }) {
      id
    }
    eventGroupRegistrations(
      where: { userId: { _eq: $userId }, group: { eventId: { _eq: $eventId } } }
    ) {
      id
      status
      group {
        id
        title
        format
        formatCustomName
        maximumAge
        maximumRating
        minimumAge
        minimumNumberOfGames
        minimumRating
        teams(where: { members: { userId: { _eq: $userId } } }) {
          members {
            userId
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
          id
        }
      }
      invitations(where: { senderUserId: { _eq: $userId } }) {
        id
        invitationEmail
        status
      }
    }
  }
`;

export const getEventRegistrationForUser = async (
  variables: GetEventRegistrationForUserQueryVariables,
) => {
  const data = await client.request<GetEventRegistrationForUserQuery>(print(QUERY), variables);
  return data;
};
