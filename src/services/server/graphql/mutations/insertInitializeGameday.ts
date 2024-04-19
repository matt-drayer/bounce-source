import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertInitializeGamedayMutation,
  InsertInitializeGamedayMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertInitializeGameday(
    $competitionFormat: CompetitionFormatsEnum!
    $groupId: uuid!
    $nextSequence: EventGroupSequencesObjRelInsertInput
    $poolData: [EventGroupPoolsInsertInput!] = []
  ) {
    insertEventGroupSequencesOne(
      object: {
        competitionFormat: $competitionFormat
        completeReason: PENDING
        groupId: $groupId
        isSequenceComplete: false
        order: 0
        nextSequence: $nextSequence
        pools: { data: $poolData, onConflict: { constraint: event_group_pools_pkey } }
      }
      onConflict: {
        constraint: event_group_sequences_group_id_order_key
        updateColumns: [competitionFormat, completeReason, isSequenceComplete, nextSequenceId]
      }
    ) {
      id
      competitionFormat
      pools {
        id
        rounds {
          id
        }
      }
    }
  }
`;

export const insertInitializeGameday = async (
  variables: InsertInitializeGamedayMutationVariables,
) => {
  const data = await client.request<InsertInitializeGamedayMutation>(print(MUTATION), variables);
  return data;
};
