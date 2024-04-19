import Stripe from 'stripe';

export const API_VERSION = '2022-08-01';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: API_VERSION,
  typescript: true,
});

export default stripe;
