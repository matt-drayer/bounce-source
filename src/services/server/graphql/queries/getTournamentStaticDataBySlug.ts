import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetTournamentStaticDataBySlugQuery,
  GetTournamentStaticDataBySlugQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';
import { EVENT_PAGE_FIELDS } from '../fragments/eventPageFields';

const QUERY = gql`
  query getTournamentStaticDataBySlug($slug: String!) {
    events(where: { slug: { _eq: $slug } }) {
      ...eventPageFields
    }
  }
  ${EVENT_PAGE_FIELDS}
`;

export const getTournamentStaticDataBySlug = async (
  variables: GetTournamentStaticDataBySlugQueryVariables,
) => {
  const data = await client.request<GetTournamentStaticDataBySlugQuery>(print(QUERY), variables);
  return data;
};
