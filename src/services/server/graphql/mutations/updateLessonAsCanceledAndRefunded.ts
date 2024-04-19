import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateLessonAsCanceledAndRefundedMutation,
  UpdateLessonAsCanceledAndRefundedMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateLessonAsCanceledAndRefunded(
    $lessonId: uuid!
    $participantUpdates: [LessonParticipantsUpdates!]!
    $orderItemUpdates: [LessonOrderItemsUpdates!]!
    $orderUpdates: [LessonOrdersUpdates!]!
  ) {
    updateLessonsByPk(
      pkColumns: { id: $lessonId }
      _set: { canceledAt: "now()", status: CANCELED }
    ) {
      id
    }
    updateLessonParticipantsMany(updates: $participantUpdates) {
      returning {
        id
      }
    }
    updateLessonOrderItemsMany(updates: $orderItemUpdates) {
      returning {
        id
      }
    }
    updateLessonOrdersMany(updates: $orderUpdates) {
      returning {
        id
      }
    }
  }
`;

export const updateLessonAsCanceledAndRefunded = async (
  variables: UpdateLessonAsCanceledAndRefundedMutationVariables,
) => {
  const data = await client.request<UpdateLessonAsCanceledAndRefundedMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
