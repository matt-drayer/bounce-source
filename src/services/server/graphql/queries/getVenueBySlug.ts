import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetVenueBySlugQuery, GetVenueBySlugQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getVenueBySlug($slug: String!) {
    venues(where: { slug: { _eq: $slug }, isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
      accessType
      addressString
      amenities {
        id
        amenity
      }
      city {
        id
        latitude
        longitude
        name
        slug
        timezone
        countrySubdivision {
          id
          latitude
          longitude
          name
          slug
          country {
            name
            nameSlug
            slug
            id
          }
        }
        venues(limit: 4) {
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
      }
      coordinatesWkb
      courtSurfaces {
        id
        courtSurface
      }
      email
      facilityType
      featuredPriority
      hasPickleball
      hasReservations
      id
      images(where: { isVisible: { _eq: true }, deletedAt: { _isNull: true } }) {
        id
        fileName
        fileType
        host
        path
        provider
        url
      }
      indoorCourtCount
      latitude
      longitude
      outdoorCourtCount
      phoneNumber
      pickleballLines
      pickleballNets
      scheduleDetails
      shouldHideDefaultDescription
      slug
      timezone
      title
      websiteUrl
    }
  }
`;

export const getVenueBySlug = async (variables: GetVenueBySlugQueryVariables) => {
  const data = await client.request<GetVenueBySlugQuery>(print(QUERY), variables);
  return data;
};
