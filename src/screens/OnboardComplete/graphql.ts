import { gql } from '@apollo/client';

export const SET__ONBOARD_COMPLETE = gql`
  mutation setOnboardComplete($id: uuid!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { isOnboardComplete: true }) {
      id
      isOnboardComplete
    }
  }
`;
