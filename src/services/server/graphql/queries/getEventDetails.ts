import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetEventDetailsQuery, GetEventDetailsQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventDetails($id: uuid!) {
    eventsByPk(id: $id) {
      addressString
      cityId
      coverImageFileName
      coverImagePath
      coverImageUrl
      currency
      createdAt
      description
      displayLocation
      endDate
      endDateTime
      externalUrl
      geometry
      hasPrizes
      id
      isExternal
      organizerImageUrl
      organizerImagePath
      locale
      isSanctioned
      privacy
      prizeDescription
      publishedAt
      registrationClosedAt
      registrationDeadlineDate
      registrationDeadlineDateTime
      registrationPriceUnitAmount
      registrationOpenDate
      registrationOpenDateTime
      isRatingRequired
      slug
      scoringFormat
      sport
      startDate
      startDateTime
      status
      title
      type
      timezoneName
      timezoneOffsetMinutes
      timezoneAbbreviation
      sourceRegistrationCount
      sourceOrganizerTitle
      groupFormat
      city {
        id
        name
        slug
        countrySubdivision {
          id
          name
          slug
          code
          country {
            id
            name
            slug
          }
        }
      }
      venue {
        id
        title
        slug
        pickleballLines
        pickleballNets
        longitude
        latitude
        geometry
        addressString
        outdoorCourtCount
        indoorCourtCount
        timezone
        images {
          id
          path
          url
        }
        courtSurfaces {
          id
          courtSurface
        }
      }
      pickleballRatingScale {
        id
        maximum
        minimum
        name
        shortName
      }
      hostUserProfile {
        id
        fullName
        profileImagePath
        profileImageProviderUrl
        preferredName
        profileImageFileName
        profileImageProvider
      }
      faqs {
        id
        question
        answer
      }
      ballCustomName
      ballType
      registrations {
        id
        userProfile {
          id
          fullName
          username
          preferredName
          profileImageFileName
          profileImagePath
          profileImageProvider
          profileImageProviderUrl
        }
      }
      groups {
        id
        gender
        gamesPerMatch
        formatCustomName
        format
        endsAt
        maximumAge
        maximumRating
        minimumNumberOfGames
        minimumAge
        minimumRating
        priceUnitAmount
        scoringFormat
        startsAt
        teamLimit
        teamType
        title
        totalPoints
        winBy
        teams {
          id
          members {
            id
            userId
            userProfile {
              id
              fullName
              preferredName
              profileImageFileName
              profileImagePath
              profileImageProvider
              profileImageProviderUrl
            }
          }
        }
        registrations {
          id
          userId
          userProfile {
            id
            preferredName
            profileImageFileName
            profileImagePath
            profileImageProvider
            profileImageProviderUrl
          }
        }
      }
      hostUser {
        id
        stripeMerchantId
      }
    }
  }
`;

export const getEventDetails = async (variables: GetEventDetailsQueryVariables) => {
  const data = await client.request<GetEventDetailsQuery>(print(QUERY), variables);
  return data;
};
