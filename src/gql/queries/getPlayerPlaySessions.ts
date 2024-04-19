import { gql } from '@apollo/client';

export const GET_PLAYER_PLAY_SESSIONS = gql`
  query getPlayerPlaySessions($userId: uuid!) {
    playSessionParticipants(
      where: {
        userId: { _eq: $userId }
        status: { _eq: ACTIVE }
        playSession: { status: { _eq: ACTIVE } }
      }
    ) {
      id
      status
      playSession {
        ...playSessionFields
      }
    }
    playSessions(where: { status: { _eq: ACTIVE }, organizerUserId: { _eq: $userId } }) {
      ...playSessionFields
    }
  }
`;
