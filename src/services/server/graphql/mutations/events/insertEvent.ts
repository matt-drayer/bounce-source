import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { Mutation_RootInsertEventsOneArgs } from 'types/generated/server';
import { Events } from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertEventsOne($object: EventsInsertInput!) {
    insertEventsOne(object: $object) {
      id
    }
  }
`;

export const insertEvent = async (variables: Mutation_RootInsertEventsOneArgs) => {
  return client.request<{ insertEventsOne: Events }>(print(MUTATION), variables);
};
