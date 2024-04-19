import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdatePlaySessionReminderEventIdMutation,
  UpdatePlaySessionReminderEventIdMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updatePlaySessionReminderEventId($id: uuid!, $reminderEventId: uuid!) {
    updatePlaySessionsByPk(pkColumns: { id: $id }, _set: { reminderEventId: $reminderEventId }) {
      id
      reminderEventId
    }
  }
`;

export const updatePlaySessionReminderEventId = async (
  variables: UpdatePlaySessionReminderEventIdMutationVariables,
) => {
  const data = await client.request<UpdatePlaySessionReminderEventIdMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
