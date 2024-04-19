import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetTournamentStaticDataByIdQuery,
  GetTournamentStaticDataByIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';
import { EVENT_PAGE_FIELDS } from '../fragments/eventPageFields';

const QUERY = gql`
  query getTournamentStaticDataById($id: uuid!) {
    eventsByPk(id: $id) {
      ...eventPageFields
    }
  }
  ${EVENT_PAGE_FIELDS}
`;

export const getTournamentStaticDataById = async (
  variables: GetTournamentStaticDataByIdQueryVariables,
) => {
  const data = await client.request<GetTournamentStaticDataByIdQuery>(print(QUERY), variables);
  return data;
};
