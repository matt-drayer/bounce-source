import Stripe from 'stripe';
import { getChargeById } from 'services/server/stripe/getChargeById';
import { mapStripeChargeWebhookToDatabase } from 'services/server/stripe/mapStripeChargeWebhookToDatabase';

export const handleChargeRefund = async (event: Stripe.Event) => {
  const eventCharge = event.data.object as Stripe.Charge;

  if (!eventCharge) {
    throw new Error('handleChargeSucceeded: Charge not valid');
  }

  const charge = await getChargeById(
    typeof eventCharge === 'string' ? eventCharge : eventCharge.id || '',
  );

  await mapStripeChargeWebhookToDatabase(charge);

  // TODO: Handle any changes to the database order

  return;
};
