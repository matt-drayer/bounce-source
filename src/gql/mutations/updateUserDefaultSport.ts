import { gql } from '@apollo/client';

export const UPDATE_USER_DEFAULT_SPORT = gql`
  mutation updateUserDefaultSport($id: uuid!, $defaultSport: SportsEnum!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { defaultSport: $defaultSport }) {
      defaultSport
      id
    }
  }
`;
