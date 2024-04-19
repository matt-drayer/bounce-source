import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdatePoolsForMatchesMutation,
  UpdatePoolsForMatchesMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updatePoolsForMatches($poolId: uuid!, $roundId: uuid!) {
    updateEventMatches(where: { roundId: { _eq: $roundId } }, _set: { poolId: $poolId }) {
      affectedRows
    }
  }
`;

export const updatePoolsForMatches = async (variables: UpdatePoolsForMatchesMutationVariables) => {
  const data = await client.request<UpdatePoolsForMatchesMutation>(print(MUTATION), variables);
  return data;
};
