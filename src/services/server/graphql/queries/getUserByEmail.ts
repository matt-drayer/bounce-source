import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetUserByEmailQuery, GetUserByEmailQueryVariables } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
      stripeCustomerId
      firebaseId
    }
  }
`;

export const getUserByEmail = async (variables: GetUserByEmailQueryVariables) => {
  const data = await client.request<GetUserByEmailQuery>(print(QUERY), variables);
  return data?.users?.[0];
};
