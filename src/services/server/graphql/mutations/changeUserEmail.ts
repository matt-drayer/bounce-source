import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { ChangeUserEmailMutation, ChangeUserEmailMutationVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation changeUserEmail($id: uuid!, $email: String!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { email: $email }) {
      id
      email
    }
  }
`;

export const changeUserEmail = (variables: ChangeUserEmailMutationVariables) => {
  return client.request<ChangeUserEmailMutation>(print(MUTATION), variables);
};
