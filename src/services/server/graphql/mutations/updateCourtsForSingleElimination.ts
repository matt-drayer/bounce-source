import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateCourtsForSingleEliminationMutation,
  UpdateCourtsForSingleEliminationMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateCourtsForSingleElimination($updates: [EventCourtsUpdates!] = []) {
    updateEventCourtsMany(updates: $updates) {
      returning {
        id
        courtNumber
        activeEventGroupId
        activeEventGroupPoolId
        activeMatchId
      }
    }
  }
`;

export const updateCourtsForSingleElimination = async (
  variables: UpdateCourtsForSingleEliminationMutationVariables,
) => {
  const data = await client.request<UpdateCourtsForSingleEliminationMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
