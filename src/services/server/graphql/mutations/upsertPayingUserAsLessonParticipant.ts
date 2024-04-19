import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertPayingUserAsLessonParticipantMutation,
  UpsertPayingUserAsLessonParticipantMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertPayingUserAsLessonParticipant($lessonId: uuid!, $userId: uuid!) {
    insertLessonParticipantsOne(
      object: {
        addedByPersona: PLAYER
        addedAt: "now()"
        lessonId: $lessonId
        paidAt: "now()"
        status: ACTIVE
        userId: $userId
      }
      onConflict: {
        constraint: lesson_participants_lesson_id_user_id_key
        updateColumns: [addedByUserId]
      }
    ) {
      addedByUserId
      addedAt
      addedByPersona
      createdAt
      id
      lessonId
      paidAt
      status
      userId
    }
  }
`;

export const upsertPayingUserAsLessonParticipant = async (
  variables: UpsertPayingUserAsLessonParticipantMutationVariables,
) => {
  const data = await client.request<UpsertPayingUserAsLessonParticipantMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
