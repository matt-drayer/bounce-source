import { gql } from '@apollo/client';

export const GET_PLAYER_LESSONS = gql`
  query getPlayerLessons($userId: uuid!) {
    lessonParticipants(
      where: {
        userId: { _eq: $userId }
        status: { _eq: ACTIVE }
        lesson: { status: { _eq: ACTIVE } }
      }
    ) {
      id
      status
      lesson {
        ...lessonFields
      }
    }
  }
`;
