import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetCountryPageByIdQuery, GetCountryPageByIdQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getCountryPageById($id: String!) {
    countriesByPk(id: $id) {
      id
      iso2
      iso3
      slug
      name
      latitude
      longitude
      subdivisions {
        id
        name
        slug
        cities {
          id
          name
          slug
          venuesAggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;

export const getCountryPageById = async (variables: GetCountryPageByIdQueryVariables) => {
  const data = await client.request<GetCountryPageByIdQuery>(print(QUERY), variables);
  return data;
};
