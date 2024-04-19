import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateLessonReminderEventIdMutation,
  UpdateLessonReminderEventIdMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateLessonReminderEventId($id: uuid!, $reminderEventId: uuid!) {
    updateLessonsByPk(pkColumns: { id: $id }, _set: { reminderEventId: $reminderEventId }) {
      id
      reminderEventId
    }
  }
`;

export const updateLessonReminderEventId = async (
  variables: UpdateLessonReminderEventIdMutationVariables,
) => {
  const data = await client.request<UpdateLessonReminderEventIdMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
