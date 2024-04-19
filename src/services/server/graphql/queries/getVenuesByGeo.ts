import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetVenuesByGeoQuery, GetVenuesByGeoQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getVenuesByGeo($distance: Float!, $from: geography!) {
    venues(
      where: {
        geometry: { _stDWithin: { distance: $distance, from: $from } }
        deletedAt: { _isNull: true }
        isActive: { _eq: true }
      }
      limit: 1000
      orderBy: { geometry: ASC }
    ) {
      id
      title
      geometry
      slug
      addressString
      accessType
      indoorCourtCount
      outdoorCourtCount
      pickleballNets
      images {
        id
        fileName
        url
      }
      city {
        id
        name
        countrySubdivision {
          id
          name
        }
      }
    }
  }
`;

export const getVenuesByGeo = async (variables: GetVenuesByGeoQueryVariables) => {
  const data = await client.request<GetVenuesByGeoQuery>(print(QUERY), variables);
  return data;
};
