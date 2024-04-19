import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertInitializeSingleEliminationMutation,
  InsertInitializeSingleEliminationMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertInitializeSingleElimination(
    $seedingObjects: [EventGroupSequenceSeedingInsertInput!] = []
    $roundRobinSequenceId: uuid!
    $teamsData: [EventPoolsTeamsInsertInput!] = []
    $nextSequenceId: uuid!
    $groupId: uuid!
    $startsAt: timestamptz
    $endsAt: timestamptz
  ) {
    insertEventGroupSequenceSeeding(objects: $seedingObjects) {
      returning {
        id
        seed
      }
    }
    updateEventGroupSequencesByPk(
      pkColumns: { id: $roundRobinSequenceId }
      _set: { isSequenceComplete: true, completeReason: ALL_SCORES }
    ) {
      id
    }
    insertEventGroupPoolsOne(
      object: {
        teams: { data: $teamsData }
        sequenceId: $nextSequenceId
        groupId: $groupId
        startsAt: $startsAt
        endsAt: $endsAt
      }
    ) {
      id
      sequenceId
      groupId
    }
  }
`;

export const insertInitializeSingleElimination = async (
  variables: InsertInitializeSingleEliminationMutationVariables,
) => {
  const data = await client.request<InsertInitializeSingleEliminationMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
