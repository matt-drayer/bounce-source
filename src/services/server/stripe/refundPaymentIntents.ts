import Stripe from 'stripe';
import stripe from 'services/server/stripe/instance';
import { setTimeoutPromise } from 'utils/shared/setTimeoutPromise';

const MAX_REQUESTS_PER_PAGE = 50;
const TIMEOUT = 1000;

type RefundResponseType = (Stripe.Refund & {
  lastResponse: {
    headers: {
      [key: string]: string;
    };
    requestId: string;
    statusCode: number;
    apiVersion?: string | undefined;
    idempotencyKey?: string | undefined;
    stripeAccount?: string | undefined;
  };
})[];

export const refundPaymentIntents = async (paymentIntentIds: string[]) => {
  let refunds: RefundResponseType = [];

  for (let i = 0; i < paymentIntentIds.length; i += MAX_REQUESTS_PER_PAGE) {
    const pageOfPaymentIntentIds = paymentIntentIds.slice(i, i + MAX_REQUESTS_PER_PAGE);
    const refundRequests = pageOfPaymentIntentIds.map((paymentIntentId) => {
      return stripe.refunds.create({
        payment_intent: paymentIntentId,
        reverse_transfer: true,
        refund_application_fee: true,
      });
    });
    const refundResponses = await Promise.all(refundRequests);
    refunds = [...refunds, ...refundResponses];

    const hasMoreRefunds = i + MAX_REQUESTS_PER_PAGE < paymentIntentIds.length;
    if (hasMoreRefunds) {
      // Reduce risk of histting Stripe rate limits (100 req/s for entire app)
      await setTimeoutPromise(TIMEOUT);
    }
  }

  return refunds;
};
