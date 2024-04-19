import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetUserByStripeCustomerIdQuery,
  GetUserByStripeCustomerIdQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getUserByStripeCustomerId($stripeCustomerId: String!) {
    users(where: { stripeCustomerId: { _eq: $stripeCustomerId } }) {
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

export const getUserByStripeCustomerId = async (
  variables: GetUserByStripeCustomerIdQueryVariables,
) => {
  const data = await client.request<GetUserByStripeCustomerIdQuery>(print(QUERY), variables);
  return data;
};
