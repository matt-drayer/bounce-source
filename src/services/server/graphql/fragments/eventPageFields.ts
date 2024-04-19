import { gql } from '@apollo/client';

export const EVENT_PAGE_FIELDS = gql`
  fragment eventPageFields on Events {
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
    isRatingRequired
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
      venueSlug
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
    }
    faqs {
      id
      question
      answer
    }
    ballCustomName
    ballType
  }
`;
