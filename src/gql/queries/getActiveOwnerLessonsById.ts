import { gql } from '@apollo/client';

export const GET_ACTIVE_OWNER_LESSONS_BY_ID = gql`
  query getActiveOwnerLessonsById($ownerUserId: uuid!) {
    lessons(where: { ownerUserId: { _eq: $ownerUserId }, status: { _eq: ACTIVE } }) {
      ...lessonFields
    }
  }
`;
