import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertTournamentTransactionMutation,
  InsertTournamentTransactionMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertTournamentTransaction($object: EventTransactionsInsertInput = {}) {
    insertEventTransactionsOne(
      object: $object
      onConflict: {
        constraint: event_transactions_external_stripe_payment_intent_id_key
        updateColumns: updatedAt
      }
    ) {
      id
    }
  }
`;

export const insertTournamentTransaction = async (
  variables: InsertTournamentTransactionMutationVariables,
) => {
  const data = await client.request<InsertTournamentTransactionMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
