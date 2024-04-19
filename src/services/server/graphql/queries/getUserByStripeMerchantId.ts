import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetUserByStripeMerchantIdQuery,
  GetUserByStripeMerchantIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getUserByStripeMerchantId($stripeMerchantId: String!) {
    users(where: { stripeMerchantId: { _eq: $stripeMerchantId } }) {
      email
      id
      stripeCustomerId
      stripeMerchantId
      stripeMerchantChargesEnabled
      stripeMerchantDetailsSubmitted
      stripeMerchantEventuallyDue
      stripeMerchantCurrentlyDue
      stripeMerchantPastDue
      stripeMerchantPayoutsEnabled
      stripeMerchantCountry
      stripeMerchantBusinessType
      stripeMerchantCurrency
    }
  }
`;

export const getUserByStripeMerchantId = async (
  variables: GetUserByStripeMerchantIdQueryVariables,
) => {
  const data = await client.request<GetUserByStripeMerchantIdQuery>(print(QUERY), variables);
  return data;
};
