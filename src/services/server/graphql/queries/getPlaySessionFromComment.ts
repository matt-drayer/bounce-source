import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetPlaySessionFromCommentQuery,
  GetPlaySessionFromCommentQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getPlaySessionFromComment($id: uuid!) {
    playSessionCommentsByPk(id: $id) {
      id
      userId
      content
      playSession {
        cancelReason
        canceledAt
        deletedAt
        competitiveness
        courtBookingStatus
        createdAt
        currency
        description
        endDateTime
        extraRacketCount
        format
        id
        isBringingNet
        participantLimit
        sport
        startDateTime
        status
        targetSkillLevel
        title
        userCustomCourtId
        locale
        timezoneOffsetMinutes
        timezoneName
        timezoneAbbreviation
        publishedAt
        priceUnitAmount
        updatedAt
        organizerUserId
        reminderEventId
        organizer {
          id
          preferredName
          profileImageFileName
          profileImagePath
          profileImageProviderUrl
          fullName
          username
          email
        }
        userCustomCourt {
          createdAt
          fullAddress
          id
          title
          updatedAt
        }
        participantsAggregate(where: { status: { _eq: ACTIVE } }) {
          aggregate {
            count
          }
        }
        participants {
          id
          playSessionId
          userId
          status
          user {
            id
            preferredName
            fullName
            username
            email
            profileImageFileName
            profileImagePath
            profileImageProviderUrl
            coverImageFileName
            coverImagePath
            coverImageProviderUrl
          }
        }
      }
    }
  }
`;

export const getPlaySessionFromComment = async (
  variables: GetPlaySessionFromCommentQueryVariables,
) => {
  const data = await client.request<GetPlaySessionFromCommentQuery>(print(QUERY), variables);
  return data;
};
