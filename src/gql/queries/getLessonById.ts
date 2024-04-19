import { gql } from '@apollo/client';

export const GET_LESSON_BY_ID = gql`
  query getLessonById($id: uuid!) {
    lessonsByPk(id: $id) {
      ...lessonFields
    }
  }
`;
