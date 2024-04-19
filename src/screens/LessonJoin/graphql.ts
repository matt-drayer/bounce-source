import { gql } from '@apollo/client';

export const GET_USER_CREDIT_CARDS = gql`
  query getUserCreditCards($userId: uuid!) {
    userCreditCards(where: { userId: { _eq: $userId } }, orderBy: { updatedAt: DESC }) {
      id
      last4
      provider
      providerCardId
      expireYear
      expireMonth
      brand
      billingName
      billingPostalCode
    }
  }
`;
