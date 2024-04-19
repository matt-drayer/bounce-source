import { gql } from '@apollo/client';

export const GET_PUBLISHED_EVENTS = gql`
  query getPublishedEvents {
    events {
      id
      title
      cityString
      startDateTime
      addressString
      displayLocation
      endDate
      coverImageUrl
      endDateTime
      latitude
      longitude
      status
      startDate
      publishedAt
      city {
        id
        name
        countrySubdivision {
          id
          name
          code
        }
      }
    }
  }
`;

const UPDATE_EVENT_BY_ID = gql`
  mutation UpdateEventContents($id: uuid!, $input: EventsSetInput!) {
    updateEventsByPk(pkColumns: { id: $id }, _set: $input) {
      id
      title
      hasPrizes
      isSanctioned
      privacy
      registrationDeadlineDate
      registrationPriceUnitAmount
      coverImageUrl
    }
  }
`;

const UPDATE_FAQ_BY_ID = gql`
  mutation UpdateFaqById($id: uuid!, $input: EventFaqsSetInput!) {
    updateEventFaqsByPk(pkColumns: { id: $id }, _set: $input) {
      id
      answer
      question
    }
  }
`;
const UPDATE_SPONSOR_BY_ID = gql`
  mutation UpdateEventSponsorsByPk($id: uuid!, $input: EventSponsorsSetInput!) {
    updateEventSponsorsByPk(pkColumns: { id: $id }, _set: $input) {
      id
      name
      isTitleSponsor
      categoryName
      imageUrl
    }
  }
`;

const UPDATE_EVENT_GROUP_BY_ID = gql`
  mutation UpdateEventGroupsByPk($id: uuid!, $input: EventGroupsSetInput!) {
    updateEventGroupsByPk(pkColumns: { id: $id }, _set: $input) {
      id
      title
      format
      formatCustomName
      gamesPerMatch
      gender
      maximumAge
      minimumAge
      maximumRating
      minimumRating
      minimumNumberOfGames
      priceUnitAmount
      teamLimit
      scoringFormat
      startsAt
      endsAt
    }
  }
`;

// const UPDATE_VENUE_BY_ID = gql`
// mutation UpdateVenuesByPk($id: uuid!, $input: VenuesSetInput!) {
//   updateVenuesByPk(pkColumns: { id: $id }, _set: $input) {
//     id
// `
