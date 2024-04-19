import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { EventFaqs } from 'types/generated/server';
import { Mutation_RootInsertEventFaqsArgs } from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertEventFaqs($objects: [EventFaqsInsertInput!]!) {
    insertEventFaqs(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const insertEventFaqs = async (variables: Mutation_RootInsertEventFaqsArgs) => {
  return client.request<{ insertEventFaqs: EventFaqs }>(print(MUTATION), variables);
};
