import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateUserStripeMerchantIdMutation,
  UpdateUserStripeMerchantIdMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateUserStripeMerchantId($id: uuid!, $stripeMerchantId: String!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { stripeMerchantId: $stripeMerchantId }) {
      id
      stripeMerchantId
    }
  }
`;

export const updateUserStripeMerchantId = async (
  variables: UpdateUserStripeMerchantIdMutationVariables,
) => {
  const data = await client.request<UpdateUserStripeMerchantIdMutation>(print(MUTATION), variables);
  return data;
};
