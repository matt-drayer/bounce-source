import Stripe from 'stripe';
import { upsertStripeCharge } from 'services/server/graphql/mutations/upsertStripeCharge';
import { upsertStripeChargeAndPaymentIntent } from 'services/server/graphql/mutations/upsertStripeChargeAndPaymentIntent';
import { getChargeById } from 'services/server/stripe/getChargeById';

export const mapStripeChargeWebhookToDatabase = async (eventCharge: Stripe.Charge) => {
  const chargeId = eventCharge.id;
  const charge = await getChargeById(chargeId);
  const paymentIntent = charge.payment_intent;

  if (!!paymentIntent && typeof paymentIntent !== 'string') {
    await upsertStripeChargeAndPaymentIntent({
      amount: charge.amount,
      amountCaptured: charge.amount_captured,
      amountRefunded: charge.amount_refunded,
      application:
        typeof charge.application === 'string' ? charge.application : charge.application?.id || '',
      applicationFee:
        typeof charge.application_fee === 'string'
          ? charge.application_fee
          : charge.application_fee?.id || '',
      applicationFeeAmount: charge.application_fee_amount,
      calculatedStatementDescriptor: charge.calculated_statement_descriptor,
      captured: charge.captured,
      chargeId: charge.id,
      currency: charge.currency,
      disputed: charge.disputed,
      externalStripePaymentIntentId: paymentIntent.id,
      paid: charge.paid,
      paymentMethod: charge.payment_method,
      refunded: charge.refunded,
      stripeCustomerId:
        typeof charge.customer === 'string' ? charge.customer : charge.customer?.id || '',
      transferDataAmount: charge.transfer_data?.amount,
      transferDataDestination:
        typeof charge.transfer_data?.destination === 'string'
          ? charge.transfer_data?.destination
          : charge.transfer_data?.destination?.id || '',
      paymentIntentAmount: paymentIntent.amount,
      paymentIntentAmountCapturable: paymentIntent.amount_capturable,
      paymentIntentAmountReceived: paymentIntent.amount_received,
      paymentIntentApplication:
        typeof paymentIntent.application === 'string'
          ? paymentIntent.application
          : paymentIntent.application?.id || '',
      paymentIntentApplicationFeeAmount: paymentIntent.application_fee_amount,
      cancellationReason: paymentIntent.cancellation_reason,
      paymentIntentCurrency: paymentIntent.currency,
      onBehalfOf:
        typeof paymentIntent.on_behalf_of === 'string'
          ? paymentIntent.on_behalf_of
          : paymentIntent.on_behalf_of?.id,
      paymentIntentId: paymentIntent.id,
      paymentIntentPaymentMethod:
        typeof paymentIntent.payment_method === 'string'
          ? paymentIntent.payment_method
          : paymentIntent.payment_method?.id,
      statementDescriptor: paymentIntent.statement_descriptor,
      status: paymentIntent.status,
      paymentIntentStripeCustomerId:
        typeof paymentIntent.customer === 'string'
          ? paymentIntent.customer
          : paymentIntent.customer?.id || '',
      paymentIntentTransferDataAmount: paymentIntent.transfer_data?.amount,
      paymentIntentTransferDataDestination:
        typeof paymentIntent.transfer_data?.destination === 'string'
          ? paymentIntent.transfer_data?.destination
          : paymentIntent.transfer_data?.destination?.id || '',
      transferGroup: paymentIntent.transfer_group,
      transferId: typeof charge.transfer === 'string' ? charge.transfer : charge.transfer?.id || '',
      sourceTransfer:
        typeof charge.source_transfer === 'string'
          ? charge.source_transfer
          : charge.source_transfer?.id || '',
    });
  } else {
    await upsertStripeCharge({
      amount: charge.amount,
      amountCaptured: charge.amount_captured,
      amountRefunded: charge.amount_refunded,
      application:
        typeof charge.application === 'string' ? charge.application : charge.application?.id || '',
      applicationFee:
        typeof charge.application_fee === 'string'
          ? charge.application_fee
          : charge.application_fee?.id || '',
      applicationFeeAmount: charge.application_fee_amount,
      calculatedStatementDescriptor: charge.calculated_statement_descriptor,
      captured: charge.captured,
      chargeId: charge.id,
      currency: charge.currency,
      disputed: charge.disputed,
      externalStripePaymentIntentId: paymentIntent,
      paid: charge.paid,
      paymentMethod: charge.payment_method || undefined,
      refunded: charge.refunded,
      stripeCustomerId:
        typeof charge.customer === 'string' ? charge.customer : charge.customer?.id || '',
      transferDataAmount: charge.transfer_data?.amount,
      transferDataDestination:
        typeof charge.transfer_data?.destination === 'string'
          ? charge.transfer_data?.destination
          : charge.transfer_data?.destination?.id || '',
      transferId: typeof charge.transfer === 'string' ? charge.transfer : charge.transfer?.id || '',
      sourceTransfer:
        typeof charge.source_transfer === 'string'
          ? charge.source_transfer
          : charge.source_transfer?.id || '',
    });
  }
};
