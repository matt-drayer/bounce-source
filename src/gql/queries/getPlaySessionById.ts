import { gql } from '@apollo/client';

export const GET_PLAY_SESSION_BY_ID = gql`
  query getPlaySessionById($id: uuid!) {
    playSessionsByPk(id: $id) {
      ...playSessionFields
    }
  }
`;
