import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertLessonWaitlistMutation,
  UpsertLessonWaitlistMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertLessonWaitlist($objects: [LessonWaitlistsInsertInput!]!) {
    insertLessonWaitlists(
      objects: $objects
      onConflict: { constraint: lesson_waitlists_user_id_lesson_id_key, updateColumns: status }
    ) {
      returning {
        lessonId
        status
        userId
        id
      }
    }
  }
`;

export const upsertLessonWaitlist = async (variables: UpsertLessonWaitlistMutationVariables) => {
  const data = await client.request<UpsertLessonWaitlistMutation>(print(MUTATION), variables);
  return data;
};
