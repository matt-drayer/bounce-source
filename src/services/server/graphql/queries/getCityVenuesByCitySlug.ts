import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetCityVenuesByCitySlugQuery,
  GetCityVenuesByCitySlugQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getCityVenuesByCitySlug($slug: String!) {
    cities(where: { slug: { _eq: $slug } }) {
      id
      latitude
      longitude
      name
      slug
      timezone
      venues {
        accessType
        addressString
        id
        pickleballNets
        slug
        outdoorCourtCount
        indoorCourtCount
        title
        images(where: { isVisible: { _eq: true } }) {
          id
          isVisible
          fileName
          fileType
          path
          provider
          url
        }
      }
      countrySubdivision {
        id
        name
        slug
        country {
          id
          name
          nameSlug
          slug
        }
      }
    }
  }
`;

export const getCityVenuesByCitySlug = async (variables: GetCityVenuesByCitySlugQueryVariables) => {
  const data = await client.request<GetCityVenuesByCitySlugQuery>(print(QUERY), variables);
  return data;
};
