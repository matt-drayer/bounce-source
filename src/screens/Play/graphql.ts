import { gql } from '@apollo/client';

export const GET_PLAY_SESSION_FEED = gql`
  query getPlaySessionFeed($startDateTime: timestamptz!, $groupId: uuid!, $userId: uuid!) {
    playSessions(
      where: {
        startDateTime: { _gte: $startDateTime }
        groupId: { _eq: $groupId }
        status: { _eq: ACTIVE }
        privacy: { _eq: PUBLIC }
      }
    ) {
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

export const GET_ACTIVE_JOINED_PLAY_SESSIONS = gql`
  query getActiveJoinedPlaySessions($userId: uuid!, $startDateTime: timestamptz!) {
    # playSessions(
    #   where: {
    #     organizerUserId: { _eq: $userId }
    #     status: { _eq: ACTIVE }
    #     startDateTime: { _gte: $startDateTime }
    #   }
    # ) {
    #   ...playSessionFields
    #   commentsAggregate {
    #     aggregate {
    #       count
    #     }
    #   }
    # }
    playSessionParticipants(
      where: {
        userId: { _eq: $userId }
        playSession: { status: { _eq: ACTIVE }, startDateTime: { _gte: $startDateTime } }
        status: { _eq: ACTIVE }
      }
    ) {
      playSession {
        ...playSessionFields
        commentsAggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;
