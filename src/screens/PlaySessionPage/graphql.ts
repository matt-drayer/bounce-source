import { gql } from '@apollo/client';

export const SET_PLAY_SESSION_AS_ACTIVE = gql`
  mutation setPlaySessionAsActive($id: uuid!) {
    updatePlaySessionsByPk(pkColumns: { id: $id }, _set: { status: ACTIVE, publishedAt: "now()" }) {
      id
      status
      publishedAt
    }
  }
`;
