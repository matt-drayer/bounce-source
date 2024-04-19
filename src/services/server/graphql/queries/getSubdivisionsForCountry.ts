import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetSubdivisionsForCountryQuery,
  GetSubdivisionsForCountryQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getSubdivisionsForCountry($countryId: String!) {
    countrySubdivisions(where: { countryId: { _eq: $countryId } }) {
      id
      name
      type
    }
  }
`;

export const getSubdivisionsForCountry = async (
  variables: GetSubdivisionsForCountryQueryVariables,
) => {
  const data = await client.request<GetSubdivisionsForCountryQuery>(print(QUERY), variables);
  return data;
};
