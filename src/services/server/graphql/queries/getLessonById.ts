import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetLessonByIdQuery, GetLessonByIdQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getLessonById($id: uuid!) {
    lessonsByPk(id: $id) {
      cancelReason
      canceledAt
      coverImageFileName
      coverImagePath
      coverImageProviderUrl
      createdAt
      currency
      deletedAt
      description
      endDateTime
      id
      ownerUserId
      participantLimit
      paymentFulfillmentChannel
      priceUnitAmount
      privacy
      reminderEventId
      sport
      startDateTime
      status
      title
      type
      typeCustom
      updatedAt
      userCustomCourtId
      reminderEventId
      locale
      timezoneName
      timezoneAbbreviation
      timezoneOffsetMinutes
      owner {
        id
        preferredName
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        stripeMerchantId
        fullName
        email
        preferredName
        username
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
      waitlist(where: { status: { _eq: ACTIVE } }) {
        id
        status
        userId
        user {
          id
          email
          fullName
          preferredName
        }
      }
    }
  }
`;

export const getLessonById = async (variables: GetLessonByIdQueryVariables) => {
  const data = await client.request<GetLessonByIdQuery>(print(QUERY), variables);
  return data;
};
