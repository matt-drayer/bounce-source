import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertUserCreditCardMutation,
  UpsertUserCreditCardMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertUserCreditCard(
    $billingCity: String
    $billingCountry: String
    $billingEmail: String
    $billingLine1: String
    $billingLine2: String
    $billingName: String
    $billingPhone: String
    $billingPostalCode: String
    $billingState: String
    $brand: String!
    $country: String
    $expireMonth: Int!
    $expireYear: Int!
    $fingerprint: String
    $funding: String
    $last4: String!
    $providerCardId: String!
    $userId: uuid!
  ) {
    insertUserCreditCardsOne(
      object: {
        billingCity: $billingCity
        billingCountry: $billingCountry
        billingEmail: $billingEmail
        billingLine1: $billingLine1
        billingLine2: $billingLine2
        billingName: $billingName
        billingPhone: $billingPhone
        billingPostalCode: $billingPostalCode
        billingState: $billingState
        brand: $brand
        country: $country
        expireMonth: $expireMonth
        expireYear: $expireYear
        fingerprint: $fingerprint
        funding: $funding
        last4: $last4
        providerCardId: $providerCardId
        userId: $userId
      }
      onConflict: {
        constraint: user_credit_cards_provider_card_id_key
        updateColumns: [
          billingCity
          billingCountry
          billingEmail
          billingLine1
          billingLine2
          billingName
          billingPhone
          billingPostalCode
          billingState
          brand
          country
          expireMonth
          expireYear
          fingerprint
          funding
          last4
        ]
      }
    ) {
      id
      providerCardId
    }
  }
`;

export const upsertUserCreditCard = async (variables: UpsertUserCreditCardMutationVariables) => {
  const data = await client.request<UpsertUserCreditCardMutation>(print(MUTATION), variables);
  return data;
};
