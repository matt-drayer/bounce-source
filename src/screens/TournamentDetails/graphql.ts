import { gql } from '@apollo/client';

export const GET_FULL_TOURNAMENT_DETAILS = gql`
  query getEventDetails($id: uuid!) {
    eventsByPk(id: $id) {
      addressString
      cityId
      coverImageFileName
      coverImagePath
      coverImageUrl
      currency
      longitude
      latitude
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
    }
  }
`;

export const GET_USER_EVENT_REGISTRATION = gql`
  query getUserEventRegistration($eventId: uuid!, $userId: uuid!) {
    eventRegistrations(where: { eventId: { _eq: $eventId }, userId: { _eq: $userId } }) {
      id
    }
    eventGroupRegistrations(
      where: { userId: { _eq: $userId }, group: { eventId: { _eq: $eventId } } }
    ) {
      id
      status
      group {
        id
        title
        format
        formatCustomName
        maximumAge
        maximumRating
        minimumAge
        minimumNumberOfGames
        minimumRating
        teamType
        teams(where: { members: { userId: { _eq: $userId } } }) {
          members {
            userId
            id
            status
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
          id
        }
      }
      invitations(where: { senderUserId: { _eq: $userId } }) {
        id
        invitationEmail
        status
      }
    }
  }
`;

export const GET_EVENT_TEAM_INVITATION_BY_ID = gql`
  query getEventTeamInvitationById($id: uuid!) {
    eventTeamsByPk(id: $id) {
      id
      groupId
      group {
        id
      }
      members {
        id
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
  }
`;
