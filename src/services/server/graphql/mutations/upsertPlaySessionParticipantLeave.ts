import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertPlaySessionParticipantLeaveMutation,
  UpsertPlaySessionParticipantLeaveMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertPlaySessionParticipantLeave(
    $playSessionId: uuid!
    $userId: uuid!
    $status: PlaySessionParticipantStatusesEnum!
  ) {
    insertPlaySessionParticipantsOne(
      object: {
        playSessionId: $playSessionId
        status: $status
        userId: $userId
        removedAt: "now()"
        removedByPersona: PLAYER
      }
      onConflict: {
        constraint: play_session_participants_play_session_id_user_id_key
        updateColumns: [status, removedByPersona, removedAt]
      }
    ) {
      id
      status
      userId
      user {
        id
        preferredName
        fullName
        email
      }
    }
  }
`;

export const upsertPlaySessionParticipantLeave = async (
  variables: UpsertPlaySessionParticipantLeaveMutationVariables,
) => {
  const data = await client.request<UpsertPlaySessionParticipantLeaveMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
