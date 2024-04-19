import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateStripeMerchantOnboardingMutation,
  UpdateStripeMerchantOnboardingMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation updateStripeMerchantOnboarding(
    $id: uuid!
    $stripeMerchantChargesEnabled: Boolean!
    $stripeMerchantCurrentlyDue: jsonb
    $stripeMerchantDetailsSubmitted: Boolean!
    $stripeMerchantEventuallyDue: jsonb
    $stripeMerchantPastDue: jsonb
    $stripeMerchantPayoutsEnabled: Boolean!
    $stripeMerchantCountry: String
    $stripeMerchantBusinessType: String
    $stripeMerchantCurrency: String
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        stripeMerchantChargesEnabled: $stripeMerchantChargesEnabled
        stripeMerchantCurrentlyDue: $stripeMerchantCurrentlyDue
        stripeMerchantDetailsSubmitted: $stripeMerchantDetailsSubmitted
        stripeMerchantEventuallyDue: $stripeMerchantEventuallyDue
        stripeMerchantPastDue: $stripeMerchantPastDue
        stripeMerchantPayoutsEnabled: $stripeMerchantPayoutsEnabled
        stripeMerchantCountry: $stripeMerchantCountry
        stripeMerchantBusinessType: $stripeMerchantBusinessType
        stripeMerchantCurrency: $stripeMerchantCurrency
      }
    ) {
      id
      stripeMerchantId
    }
  }
`;

export const updateStripeMerchantOnboarding = async (
  variables: UpdateStripeMerchantOnboardingMutationVariables,
) => {
  const data = await client.request<UpdateStripeMerchantOnboardingMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
