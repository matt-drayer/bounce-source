import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetCountrySubdivisionPathsQuery,
  GetCountrySubdivisionPathsQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getCountrySubdivisionPaths($activeCountryId: String!) {
    countrySubdivisions(where: { countryId: { _eq: $activeCountryId } }) {
      id
      name
      slug
      cities {
        id
        name
        slug
        venues(limit: 1) {
          id
        }
      }
    }
  }
`;

export const getCountrySubdivisionPaths = async (
  variables: GetCountrySubdivisionPathsQueryVariables,
) => {
  const data = await client.request<GetCountrySubdivisionPathsQuery>(print(QUERY), variables);
  return data;
};
