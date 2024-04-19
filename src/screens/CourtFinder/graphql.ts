import { gql } from '@apollo/client';

export const GET_VENUES_BY_GET = gql`
  query getVenuesByGeo($distance: Float!, $from: geography!) {
    venues(
      where: { geometry: { _stDWithin: { distance: $distance, from: $from } } }
      limit: 1000
      orderBy: { geometry: ASC }
    ) {
      id
      title
      geometry
      slug
      pickleballLines
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
      courtSurfaces {
        id
        courtSurface
      }
    }
  }
`;
