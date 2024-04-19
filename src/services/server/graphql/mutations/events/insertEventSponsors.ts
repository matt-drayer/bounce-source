import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { Mutation_RootInsertEventSponsorsArgs } from 'types/generated/server';
import { EventSponsors } from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertEventSponsors($objects: [EventSponsorsInsertInput!]!) {
    insertEventSponsors(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const insertEventSponsors = async (variables: Mutation_RootInsertEventSponsorsArgs) => {
  return client.request<{ insertEventSponsors: EventSponsors }>(print(MUTATION), variables);
};
