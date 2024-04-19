import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateAcceptInvitationByIdMutation,
  UpdateAcceptInvitationByIdMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateAcceptInvitationById($id: uuid!, $invitedUserId: uuid!) {
    updateEventInvitationsByPk(
      pkColumns: { id: $id }
      _set: { invitedUserId: $invitedUserId, status: ACCEPTED }
    ) {
      id
    }
  }
`;

export const updateAcceptInvitationById = async (
  variables: UpdateAcceptInvitationByIdMutationVariables,
) => {
  const data = await client.request<UpdateAcceptInvitationByIdMutation>(print(MUTATION), variables);
  return data;
};
