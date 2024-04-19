import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertTournamentRegistrationMutation,
  InsertTournamentRegistrationMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertTournamentRegistration(
    $registrationObjects: [EventRegistrationsInsertInput!] = []
    $groupRegistrationObjects: [EventGroupRegistrationsInsertInput!] = []
  ) {
    insertEventRegistrations(
      objects: $registrationObjects
      onConflict: { constraint: event_registrations_event_id_user_id_key, updateColumns: updatedAt }
    ) {
      returning {
        id
      }
    }
    insertEventGroupRegistrations(
      objects: $groupRegistrationObjects
      onConflict: {
        constraint: event_group_registrations_group_id_user_id_key
        updateColumns: createdAt
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const insertTournamentRegistration = async (
  variables: InsertTournamentRegistrationMutationVariables,
) => {
  const data = await client.request<InsertTournamentRegistrationMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
