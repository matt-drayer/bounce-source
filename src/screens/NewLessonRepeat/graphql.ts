import { gql } from '@apollo/client';

export const INSERT_REPEAT_LESSONS = gql`
  mutation insertRepeatLessons($objects: [LessonsInsertInput!] = {}) {
    insertLessons(objects: $objects) {
      returning {
        ...lessonFields
      }
    }
  }
`;
