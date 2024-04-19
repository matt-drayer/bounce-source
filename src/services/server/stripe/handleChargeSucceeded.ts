import Stripe from 'stripe';
import { mapStripeChargeWebhookToDatabase } from 'services/server/stripe/mapStripeChargeWebhookToDatabase';

export const handleChargeSucceeded = async (event: Stripe.Event) => {
  const eventCharge = event.data.object as Stripe.Charge;

  if (!eventCharge) {
    throw new Error('handleChargeSucceeded: Charge not valid');
  }

  await mapStripeChargeWebhookToDatabase(eventCharge);

  return;
};
