import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetCountrySubdivisionPageQuery,
  GetCountrySubdivisionPageQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getCountrySubdivisionPage($slug: String!) {
    countrySubdivisions(where: { slug: { _eq: $slug } }) {
      id
      latitude
      longitude
      name
      slug
      type
      country {
        id
        name
        nameSlug
        slug
      }
      cities(where: { isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
        id
        name
        latitude
        longitude
        slug
        venues {
          id
          latitude
          longitude
          slug
          addressString
          title
          indoorCourtCount
          outdoorCourtCount
        }
      }
    }
  }
`;

export const getCountrySubdivisionPage = async (
  variables: GetCountrySubdivisionPageQueryVariables,
) => {
  const data = await client.request<GetCountrySubdivisionPageQuery>(print(QUERY), variables);
  return data;
};
