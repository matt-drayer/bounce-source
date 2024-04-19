import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdatePlayerRemoveFromLessonAndRefundMutation,
  UpdatePlayerRemoveFromLessonAndRefundMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updatePlayerRemoveFromLessonAndRefund(
    $id: uuid!
    $orderItemUpdates: [LessonOrderItemsUpdates!]!
    $orderUpdates: [LessonOrdersUpdates!]!
  ) {
    updateLessonParticipantsByPk(
      pkColumns: { id: $id }
      _set: {
        removedAt: "now()"
        status: INACTIVE
        removedByPersona: PLAYER
        refundedAt: "now()"
        refundedByPersona: PLAYER
      }
    ) {
      id
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

export const updatePlayerRemoveFromLessonAndRefund = async (
  variables: UpdatePlayerRemoveFromLessonAndRefundMutationVariables,
) => {
  const data = await client.request<UpdatePlayerRemoveFromLessonAndRefundMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
