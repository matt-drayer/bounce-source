import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetPlaySessionByIdQuery, GetPlaySessionByIdQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getPlaySessionById($id: uuid!) {
    playSessionsByPk(id: $id) {
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
      venue {
        id
        title
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
`;

export const getPlaySessionById = async (variables: GetPlaySessionByIdQueryVariables) => {
  const data = await client.request<GetPlaySessionByIdQuery>(print(QUERY), variables);
  return data;
};
