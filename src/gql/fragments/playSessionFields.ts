import { gql } from '@apollo/client';

export const PLAY_SESSION_FIELDS = gql`
  fragment playSessionFields on PlaySessions {
    cancelReason
    canceledAt
    deletedAt
    competitiveness
    courtBookingStatus
    createdAt
    currency
    description
    endDateTime
    extraRacketCount
    format
    groupId
    id
    isBringingNet
    participantLimit
    sport
    startDateTime
    status
    targetSkillLevel
    title
    userCustomCourtId
    locale
    timezoneOffsetMinutes
    timezoneName
    timezoneAbbreviation
    publishedAt
    priceUnitAmount
    updatedAt
    organizerUserId
    privacy
    skillRatingMaximum
    skillRatingMinimum
    organizerProfile {
      id
      preferredName
      profileImageFileName
      profileImagePath
      profileImageProviderUrl
      fullName
      username
    }
    userCustomCourt {
      createdAt
      fullAddress
      id
      title
      updatedAt
    }
    participantsAggregate(where: { status: { _eq: ACTIVE } }) {
      aggregate {
        count
      }
    }
    participants {
      id
      playSessionId
      userId
      status
      userProfile {
        id
        preferredName
        fullName
        username
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        coverImageFileName
        coverImagePath
        coverImageProviderUrl
      }
    }
    tennisRatingScale {
      id
      maximum
      minimum
      name
      order
      shortName
    }
    pickleballRatingScale {
      id
      maximum
      minimum
      name
      order
      shortName
    }
    venue {
      id
      title
      addressString
      latitude
      longitude
      images(where: { isVisible: { _eq: true } }) {
        id
        providerUrl
        path
        url
      }
    }
  }
`;
