import Stripe from 'stripe';
import { upsertUserCreditCard } from 'services/server/graphql/mutations/upsertUserCreditCard';
import { getUserByStripeCustomerId } from 'services/server/graphql/queries/getUserByStripeCustomerId';
import { getCustomerIdFromObject } from 'services/server/stripe/getCustomerIdFromObject';

export const handlePaymentMethodAttached = async (event: Stripe.Event) => {
  const eventPaymentMethod = event.data.object as Stripe.PaymentMethod;

  if (!eventPaymentMethod) {
    throw new Error('handlePaymentMethodAttached: Account not valid');
  }

  const paymentMethodId = eventPaymentMethod.id;
  const stripeCustomerId = getCustomerIdFromObject(eventPaymentMethod);

  if (!stripeCustomerId) {
    throw new Error('handlePaymentMethodAttached: Stripe customer ID not found');
  }

  const graphqlResponse = await getUserByStripeCustomerId({ stripeCustomerId: stripeCustomerId });
  const user = graphqlResponse.users[0];

  if (!user) {
    throw new Error('handlePaymentMethodAttached: User not found');
  }

  if (!paymentMethodId || !eventPaymentMethod.card) {
    return;
  }

  await upsertUserCreditCard({
    userId: user.id,
    billingCity: eventPaymentMethod?.billing_details?.address?.city,
    billingCountry: eventPaymentMethod?.billing_details?.address?.country,
    billingEmail: eventPaymentMethod?.billing_details?.email,
    billingLine1: eventPaymentMethod?.billing_details?.address?.line1,
    billingLine2: eventPaymentMethod?.billing_details?.address?.line2,
    billingName: eventPaymentMethod?.billing_details?.name,
    billingPhone: eventPaymentMethod?.billing_details?.phone,
    billingPostalCode: eventPaymentMethod?.billing_details?.address?.postal_code,
    billingState: eventPaymentMethod?.billing_details?.address?.state,
    brand: eventPaymentMethod.card.brand || '',
    country: eventPaymentMethod.card.country,
    expireMonth: eventPaymentMethod.card.exp_month || 0,
    expireYear: eventPaymentMethod.card.exp_year || 0,
    fingerprint: eventPaymentMethod.card.fingerprint,
    funding: eventPaymentMethod.card.funding,
    last4: eventPaymentMethod.card.last4 || '',
    providerCardId: paymentMethodId,
  });

  return;
};
