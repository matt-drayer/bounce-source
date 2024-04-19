import Stripe from 'stripe';
import api from 'services/client/api';

export interface Response {
  publishableKey: string | undefined;
  ephemeralKey: string | undefined;
  setupIntentClientSecret: string | undefined;
  customerId: string | null;
}

export const SETUP_INTENT_API = 'v1/payment-providers/stripe/setup-intent';

export const getSetupIntent = async () => {
  const response = await api.post(SETUP_INTENT_API, {
    payload: {},
  });
  return response as Response;
};
