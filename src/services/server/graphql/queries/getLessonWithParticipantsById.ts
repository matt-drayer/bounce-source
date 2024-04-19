import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetLessonWithParticipantsByIdQuery,
  GetLessonWithParticipantsByIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getLessonWithParticipantsById($id: uuid!) {
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
      priceUnitAmount
      privacy
      reminderEventId
      startDateTime
      locale
      timezoneName
      timezoneAbbreviation
      timezoneOffsetMinutes
      status
      title
      type
      typeCustom
      updatedAt
      userCustomCourtId
      reminderEventId
      ownerUserId
      owner {
        id
        preferredName
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        stripeMerchantId
        email
        fullName
      }
      userCustomCourt {
        createdAt
        fullAddress
        id
        title
        updatedAt
      }
      participants {
        id
        userId
        status
        user {
          id
          stripeCustomerId
          fullName
          email
          preferredName
        }
        orderItems {
          id
          priceUnitAmount
          totalUnitAmount
          status
          order {
            id
            customerApplicationFeeUnitAmount
            orderSubtotalUnitAmount
            orderTotalUnitAmount
            paidUnitAmount
            status
            paymentIntentInternal {
              id
              paymentIntentId
              amount
              amountCapturable
              amountReceived
              application
              applicationFeeAmount
              stripeCharges {
                amount
                amountCaptured
                amountRefunded
                captured
                chargeId
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const getLessonWithParticipantsById = async (
  variables: GetLessonWithParticipantsByIdQueryVariables,
) => {
  const data = await client.request<GetLessonWithParticipantsByIdQuery>(print(QUERY), variables);
  return data;
};
