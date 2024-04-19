import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateUserDefaultSportMutation,
  UpdateUserDefaultSportMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateUserDefaultSport($id: uuid!, $defaultSport: SportsEnum!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { defaultSport: $defaultSport }) {
      defaultSport
      id
    }
  }
`;

export const updateUserDefaultSport = async (
  variables: UpdateUserDefaultSportMutationVariables,
) => {
  const data = await client.request<UpdateUserDefaultSportMutation>(print(MUTATION), variables);
  return data;
};
