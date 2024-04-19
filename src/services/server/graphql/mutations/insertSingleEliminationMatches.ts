import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertSingleEliminationMatchesMutation,
  InsertSingleEliminationMatchesMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertSingleEliminationMatches($objects: [EventPoolRoundsInsertInput!] = []) {
    insertEventPoolRounds(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const insertSingleEliminationMatches = async (
  variables: InsertSingleEliminationMatchesMutationVariables,
) => {
  const data = await client.request<InsertSingleEliminationMatchesMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
