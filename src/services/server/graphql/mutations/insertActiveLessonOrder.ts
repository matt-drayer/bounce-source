import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertActiveLessonOrderMutation,
  InsertActiveLessonOrderMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertActiveLessonOrder(
    $customerApplicationFeeUnitAmount: Int!
    $customerUserId: uuid!
    $externalStripePaymentIntentId: String!
    $orderSubtotalUnitAmount: Int!
    $itemPriceUnitAmount: Int!
    $itemTotalUnitAmount: Int!
    $lessonId: uuid!
    $userId: uuid!
    $orderTotalUnitAmount: Int!
    $transferUnitAmount: Int!
    $paidUnitAmount: Int!
    $sellerApplicationFeeUnitAmount: Int!
    $applicationFeeTotalUnitAmount: Int!
    $sellerUserId: uuid!
    $stripeCustomerId: String!
    $stripeMerchantId: String!
    $stripePaymentStatus: String!
    $amount: Int!
    $amountCapturable: Int!
    $amountReceived: Int!
    $application: String
    $applicationFeeAmount: Int
    $cancellationReason: String
    $currency: String!
    $onBehalfOf: String
    $paymentIntentId: String!
    $paymentMethod: String
    $statementDescriptor: String
    $paymentIntentStatus: String!
    $paymentIntentStripeCustomerId: String!
    $transferDataAmount: Int
    $transferDataDestination: String
    $transferGroup: String
    $transferId: String
    $sourceTransfer: String
    $chargeAmount: Int!
    $amountCaptured: Int!
    $amountRefunded: Int!
    $chargeApplication: String
    $chargeApplicationFee: String
    $chargeApplicationFeeAmount: Int
    $calculatedStatementDescriptor: String
    $captured: Boolean!
    $chargeId: String!
    $chargeCurrency: String!
    $disputed: Boolean!
    $chargeExternalStripePaymentIntentId: String!
    $chargePaid: Boolean!
    $chargePaymentMethod: String
    $refunded: Boolean!
    $chargeStripeCustomerId: String!
    $userCreditCardId: uuid
  ) {
    insertLessonOrdersOne(
      object: {
        customerApplicationFeeUnitAmount: $customerApplicationFeeUnitAmount
        customerUserId: $customerUserId
        externalStripePaymentIntentId: $externalStripePaymentIntentId
        orderSubtotalUnitAmount: $orderSubtotalUnitAmount
        items: {
          data: {
            priceUnitAmount: $itemPriceUnitAmount
            totalUnitAmount: $itemTotalUnitAmount
            refundUnitAmount: 0
            status: SUCCEEDED
            lessonParticipant: {
              data: {
                addedAt: "now()"
                addedByPersona: PLAYER
                addedByUserId: $userId
                lessonId: $lessonId
                paidAt: "now()"
                status: ACTIVE
                userId: $userId
                paymentFulfillmentChannel: ON_PLATFORM
              }
              onConflict: {
                constraint: lesson_participants_lesson_id_user_id_key
                updateColumns: status
              }
            }
          }
        }
        orderTotalUnitAmount: $orderTotalUnitAmount
        paidUnitAmount: $paidUnitAmount
        transferUnitAmount: $transferUnitAmount
        paymentProcessor: STRIPE
        refundUnitAmount: 0
        sellerApplicationFeeUnitAmount: $sellerApplicationFeeUnitAmount
        applicationFeeTotalUnitAmount: $applicationFeeTotalUnitAmount
        sellerUserId: $sellerUserId
        status: SUCCEEDED
        stripeCustomerId: $stripeCustomerId
        stripeMerchantId: $stripeMerchantId
        stripePaymentStatus: $stripePaymentStatus
        userCreditCardId: $userCreditCardId
        paymentIntentInternal: {
          data: {
            amount: $amount
            amountCapturable: $amountCapturable
            amountReceived: $amountReceived
            application: $application
            applicationFeeAmount: $applicationFeeAmount
            cancellationReason: $cancellationReason
            currency: $currency
            onBehalfOf: $onBehalfOf
            paymentIntentId: $paymentIntentId
            paymentMethod: $paymentMethod
            statementDescriptor: $statementDescriptor
            status: $paymentIntentStatus
            stripeCustomerId: $paymentIntentStripeCustomerId
            transferDataAmount: $transferDataAmount
            transferDataDestination: $transferDataDestination
            transferGroup: $transferGroup
            stripeCharges: {
              data: {
                amount: $chargeAmount
                amountCaptured: $amountCaptured
                amountRefunded: $amountRefunded
                application: $chargeApplication
                applicationFee: $chargeApplicationFee
                applicationFeeAmount: $chargeApplicationFeeAmount
                calculatedStatementDescriptor: $calculatedStatementDescriptor
                captured: $captured
                chargeId: $chargeId
                currency: $chargeCurrency
                disputed: $disputed
                externalStripePaymentIntentId: $chargeExternalStripePaymentIntentId
                paid: $chargePaid
                paymentMethod: $chargePaymentMethod
                refunded: $refunded
                stripeCustomerId: $chargeStripeCustomerId
                transferDataAmount: $transferDataAmount
                transferDataDestination: $transferDataDestination
                transferId: $transferId
                sourceTransfer: $sourceTransfer
              }
              onConflict: {
                constraint: stripe_charges_charge_id_key
                updateColumns: [updatedAt, internalStripePaymentIntentId]
              }
            }
          }
          onConflict: {
            constraint: stripe_payment_intents_payment_intent_id_key
            updateColumns: updatedAt
          }
        }
      }
    ) {
      id
      items {
        id
        lessonParticipant {
          id
          status
          userId
          lessonId
          user {
            id
            fullName
          }
          lesson {
            id
            status
            startDateTime
            title
            type
            locale
            timezoneName
            timezoneAbbreviation
            timezoneOffsetMinutes
            owner {
              id
              email
              preferredName
              fullName
            }
          }
        }
      }
    }
  }
`;

export const insertActiveLessonOrder = async (
  variables: InsertActiveLessonOrderMutationVariables,
) => {
  const data = await client.request<InsertActiveLessonOrderMutation>(print(MUTATION), variables);
  return data;
};
