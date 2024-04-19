import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertStripeChargeAndPaymentIntentMutation,
  UpsertStripeChargeAndPaymentIntentMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation upsertStripeChargeAndPaymentIntent(
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
    $paymentIntentAmount: Int
    $paymentIntentAmountCapturable: Int
    $paymentIntentAmountReceived: Int
    $paymentIntentApplication: String
    $paymentIntentApplicationFeeAmount: Int
    $cancellationReason: String
    $paymentIntentCurrency: String
    $onBehalfOf: String
    $paymentIntentId: String
    $paymentIntentPaymentMethod: String
    $statementDescriptor: String
    $status: String
    $paymentIntentStripeCustomerId: String
    $paymentIntentTransferDataAmount: Int
    $paymentIntentTransferDataDestination: String
    $transferGroup: String
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
        paymentIntentInternal: {
          data: {
            amount: $paymentIntentAmount
            amountCapturable: $paymentIntentAmountCapturable
            amountReceived: $paymentIntentAmountReceived
            application: $paymentIntentApplication
            applicationFeeAmount: $paymentIntentApplicationFeeAmount
            cancellationReason: $cancellationReason
            currency: $paymentIntentCurrency
            onBehalfOf: $onBehalfOf
            paymentIntentId: $paymentIntentId
            paymentMethod: $paymentIntentPaymentMethod
            statementDescriptor: $statementDescriptor
            status: $status
            stripeCustomerId: $paymentIntentStripeCustomerId
            transferDataAmount: $paymentIntentTransferDataAmount
            transferDataDestination: $paymentIntentTransferDataDestination
            transferGroup: $transferGroup
          }
          onConflict: {
            constraint: stripe_payment_intents_payment_intent_id_key
            updateColumns: [
              amount
              amountCapturable
              amountReceived
              application
              applicationFeeAmount
              cancellationReason
              currency
              onBehalfOf
              paymentIntentId
              paymentMethod
              statementDescriptor
              status
              stripeCustomerId
              transferDataAmount
              transferDataDestination
              transferGroup
            ]
          }
        }
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

export const upsertStripeChargeAndPaymentIntent = async (
  variables: UpsertStripeChargeAndPaymentIntentMutationVariables,
) => {
  const data = await client.request<UpsertStripeChargeAndPaymentIntentMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
