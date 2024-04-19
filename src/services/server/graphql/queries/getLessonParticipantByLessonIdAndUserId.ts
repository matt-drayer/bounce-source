import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetLessonParticipantByLessonIdAndUserIdQuery,
  GetLessonParticipantByLessonIdAndUserIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getLessonParticipantByLessonIdAndUserId($lessonId: uuid!, $userId: uuid!) {
    lessonParticipants(where: { lessonId: { _eq: $lessonId }, userId: { _eq: $userId } }) {
      id
      refundedAt
      refundedByPersona
      status
      paymentFulfillmentChannel
      lesson {
        id
        status
        startDateTime
        locale
        timezoneName
        timezoneAbbreviation
        timezoneOffsetMinutes
        title
        type
        paymentFulfillmentChannel
        owner {
          id
          email
          preferredName
          fullName
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
      orderItems {
        status
        refundedByPersona
        refundedAt
        refundUnitAmount
        totalUnitAmount
        priceUnitAmount
        id
        order {
          id
          orderTotalUnitAmount
          orderSubtotalUnitAmount
          externalStripePaymentIntentId
          paidUnitAmount
          refundedAt
          refundedByPersona
          refundUnitAmount
          status
        }
      }
      userId
      user {
        id
        fullName
        email
        preferredName
      }
    }
  }
`;

export const getLessonParticipantByLessonIdAndUserId = async (
  variables: GetLessonParticipantByLessonIdAndUserIdQueryVariables,
) => {
  const data = await client.request<GetLessonParticipantByLessonIdAndUserIdQuery>(
    print(QUERY),
    variables,
  );
  return data;
};
