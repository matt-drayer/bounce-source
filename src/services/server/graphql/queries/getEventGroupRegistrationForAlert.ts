import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventGroupRegistrationForAlertQuery,
  GetEventGroupRegistrationForAlertQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventGroupRegistrationForAlert($id: uuid!) {
    eventGroupRegistrationsByPk(id: $id) {
      user {
        id
        fullName
        email
      }
      invitedPartnerEmail
      invitedPartnerName
      group {
        id
        title
        event {
          id
          title
        }
      }
    }
  }
`;

export const getEventGroupRegistrationForAlert = async (
  variables: GetEventGroupRegistrationForAlertQueryVariables,
) => {
  const data = await client.request<GetEventGroupRegistrationForAlertQuery>(
    print(QUERY),
    variables,
  );
  return data;
};
