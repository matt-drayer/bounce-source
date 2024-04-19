import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdatePlayerRemoveFromLessonMutation,
  UpdatePlayerRemoveFromLessonMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updatePlayerRemoveFromLesson($id: uuid!) {
    updateLessonParticipantsByPk(
      pkColumns: { id: $id }
      _set: { removedAt: "now()", status: INACTIVE, removedByPersona: PLAYER }
    ) {
      id
    }
  }
`;

export const updatePlayerRemoveFromLesson = async (
  variables: UpdatePlayerRemoveFromLessonMutationVariables,
) => {
  const data = await client.request<UpdatePlayerRemoveFromLessonMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
