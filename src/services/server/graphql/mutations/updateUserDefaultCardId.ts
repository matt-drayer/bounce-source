import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateUserDefaultCardIdMutation,
  UpdateUserDefaultCardIdMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateUserDefaultCardId($id: uuid!, $defaultCreditCardId: uuid = "") {
    updateUsersByPk(pkColumns: { id: $id }, _set: { defaultCreditCardId: $defaultCreditCardId }) {
      id
      defaultCreditCardId
    }
  }
`;

export const updateUserDefaultCardId = async (
  variables: UpdateUserDefaultCardIdMutationVariables,
) => {
  const data = await client.request<UpdateUserDefaultCardIdMutation>(print(MUTATION), variables);
  return data;
};
