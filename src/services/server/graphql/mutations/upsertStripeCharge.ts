import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertStripeChargeMutation,
  UpsertStripeChargeMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertStripeCharge(
    $amount: Int
    $amountCaptured: Int
    $amountRefunded: Int
    $application: String
    $applicationFee: String
    $applicationFeeAmount: Int
    $calculatedStatementDescriptor: String
    $captured: Boolean
    $chargeId: String
    $currency: String
    $disputed: Boolean
    $externalStripePaymentIntentId: String
    $paid: Boolean
    $paymentMethod: String
    $refunded: Boolean
    $stripeCustomerId: String
    $transferDataAmount: Int
    $transferDataDestination: String
    $transferId: String
    $sourceTransfer: String
  ) {
    insertStripeChargesOne(
      object: {
        amount: $amount
        amountCaptured: $amountCaptured
        amountRefunded: $amountRefunded
        application: $application
        applicationFee: $applicationFee
        applicationFeeAmount: $applicationFeeAmount
        calculatedStatementDescriptor: $calculatedStatementDescriptor
        captured: $captured
        chargeId: $chargeId
        currency: $currency
        disputed: $disputed
        externalStripePaymentIntentId: $externalStripePaymentIntentId
        paid: $paid
        paymentMethod: $paymentMethod
        refunded: $refunded
        stripeCustomerId: $stripeCustomerId
        transferDataAmount: $transferDataAmount
        transferDataDestination: $transferDataDestination
        transferId: $transferId
        sourceTransfer: $sourceTransfer
      }
      onConflict: {
        constraint: stripe_charges_charge_id_key
        updateColumns: [
          amount
          amountCaptured
          amountRefunded
          application
          applicationFee
          applicationFeeAmount
          calculatedStatementDescriptor
          captured
          chargeId
          currency
          disputed
          externalStripePaymentIntentId
          paid
          paymentMethod
          refunded
          stripeCustomerId
          transferDataAmount
          transferDataDestination
          internalStripePaymentIntentId
          transferId
          sourceTransfer
        ]
      }
    ) {
      id
    }
  }
`;

export const upsertStripeCharge = async (variables: UpsertStripeChargeMutationVariables) => {
  const data = await client.request<UpsertStripeChargeMutation>(print(MUTATION), variables);
  return data;
};
