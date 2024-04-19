import { gql } from '@apollo/client';

export const GET_PLAY_SESSION_FOR_VENUE_AS_USER = gql`
  query getPlaySessionsByVenueIdAsUser(
    $venueId: uuid!
    $startDateTime: timestamptz!
    $userId: uuid!
  ) {
    playSessions(where: { venueId: { _eq: $venueId }, startDateTime: { _gte: $startDateTime } }) {
      ...playSessionFields
      commentsAggregate {
        aggregate {
          count
        }
      }
      currentUserAsParticipant: participants(
        where: { userId: { _eq: $userId }, status: { _eq: ACTIVE } }
      ) {
        id
        status
      }
    }
  }
`;

export const GET_PLAY_SESSION_FOR_VENUE_AS_ANONYMOUS = gql`
  query getPlaySessionsByVenueIdAsAnonymous($venueId: uuid!, $startDateTime: timestamptz!) {
    playSessions(where: { venueId: { _eq: $venueId }, startDateTime: { _gte: $startDateTime } }) {
      ...playSessionFields
      commentsAggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const UPSERT_VENUE_FOLOW = gql`
  mutation upsertVenueFollow($userId: uuid!, $venueId: uuid!, $status: FollowStatusesEnum!) {
    insertVenueFollowsOne(
      object: { userId: $userId, venueId: $venueId, status: $status }
      onConflict: { constraint: venue_follows_venue_id_user_id_key, updateColumns: status }
    ) {
      status
      id
      userId
      venueId
    }
  }
`;

export const GET_USER_VENUE_FOLLOW = gql`
  query getUserVenueFollow($userId: uuid!, $venueId: uuid!) {
    venueFollows(where: { userId: { _eq: $userId }, venueId: { _eq: $venueId } }) {
      id
      userId
      venueId
      status
    }
  }
`;
