import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdatePlaySessionAsCanceledMutation,
  UpdatePlaySessionAsCanceledMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updatePlaySessionAsCanceled($id: uuid!) {
    updatePlaySessionsByPk(
      pkColumns: { id: $id }
      _set: { canceledAt: "now()", status: CANCELED }
    ) {
      id
    }
  }
`;

export const updatePlaySessionAsCanceled = async (
  variables: UpdatePlaySessionAsCanceledMutationVariables,
) => {
  const data = await client.request<UpdatePlaySessionAsCanceledMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
