import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetCountriesQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getCountries {
    countries {
      id
      name
      slug
    }
  }
`;

export const getCountries = async () => {
  const data = await client.request<GetCountriesQuery>(print(QUERY));
  return data;
};
