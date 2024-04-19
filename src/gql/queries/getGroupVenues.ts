import { gql } from '@apollo/client';

export const GET_GROUP_VENUES = gql`
  query getGroupVenues($groupId: uuid!) {
    groupVenues(where: { groupId: { _eq: $groupId } }) {
      id
      venue {
        id
        createdAt
        title
        slug
        outdoorCourtCount
        indoorCourtCount
        isActive
        accessType
        addressString
        totalCourtCount
        facilityType
        pickleballNets
        images {
          providerUrl
          id
          url
        }
        courtSurfaces {
          id
          courtSurface
        }
      }
    }
  }
`;
