import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertLessonParticipantOffPlatformPaymentMutation,
  InsertLessonParticipantOffPlatformPaymentMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertLessonParticipantOffPlatformPayment($userId: uuid!, $lessonId: uuid!) {
    insertLessonParticipantsOne(
      object: {
        addedAt: "now()"
        addedByPersona: PLAYER
        addedByUserId: $userId
        lessonId: $lessonId
        paymentFulfillmentChannel: OFF_PLATFORM
        status: ACTIVE
        userId: $userId
      }
      onConflict: { constraint: lesson_participants_lesson_id_user_id_key, updateColumns: status }
    ) {
      id
      status
      userId
      lessonId
      user {
        id
        fullName
      }
      lesson {
        id
        status
        startDateTime
        title
        type
        locale
        timezoneName
        timezoneAbbreviation
        timezoneOffsetMinutes
        owner {
          id
          email
          preferredName
          fullName
        }
      }
    }
  }
`;

export const insertLessonParticipantOffPlatformPayment = async (
  variables: InsertLessonParticipantOffPlatformPaymentMutationVariables,
) => {
  const data = await client.request<InsertLessonParticipantOffPlatformPaymentMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
