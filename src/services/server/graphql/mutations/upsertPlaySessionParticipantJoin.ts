import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertPlaySessionParticipantJoinMutation,
  UpsertPlaySessionParticipantJoinMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertPlaySessionParticipantJoin(
    $addedByUserId: uuid!
    $playSessionId: uuid!
    $userId: uuid!
    $status: PlaySessionParticipantStatusesEnum!
  ) {
    insertPlaySessionParticipantsOne(
      object: {
        addedAt: "now()"
        addedByPersona: PLAYER
        addedByUserId: $addedByUserId
        playSessionId: $playSessionId
        status: $status
        userId: $userId
      }
      onConflict: {
        constraint: play_session_participants_play_session_id_user_id_key
        updateColumns: status
      }
    ) {
      id
      status
      userId
      user {
        id
        fullName
      }
    }
  }
`;

export const upsertPlaySessionParticipantJoin = async (
  variables: UpsertPlaySessionParticipantJoinMutationVariables,
) => {
  const data = await client.request<UpsertPlaySessionParticipantJoinMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
