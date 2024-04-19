import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertEventCourtsMutation,
  InsertEventCourtsMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertEventCourts($objects: [EventCourtsInsertInput!] = []) {
    insertEventCourts(
      objects: $objects
      onConflict: { constraint: event_courts_event_id_court_number_key, updateColumns: updatedAt }
    ) {
      returning {
        id
        courtNumber
      }
    }
  }
`;

export const insertEventCourts = async (variables: InsertEventCourtsMutationVariables) => {
  const data = await client.request<InsertEventCourtsMutation>(print(MUTATION), variables);
  return data;
};
