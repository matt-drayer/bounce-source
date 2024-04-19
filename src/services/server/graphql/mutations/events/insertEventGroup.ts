import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { EventGroups } from 'types/generated/server';
import { Mutation_RootInsertEventGroupsArgs } from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertEventGroups($objects: [EventGroupsInsertInput!]!) {
    insertEventGroups(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const insertEventGroups = async (variables: Mutation_RootInsertEventGroupsArgs) => {
  return client.request<{ insertEventGroups: EventGroups }>(print(MUTATION), variables);
};
