import stripe from 'services/server/stripe/instance';

interface Params {
  paymentMethodId: string;
  customerId: string;
  amountTotal: number;
  amountTransfer: number;
  applicationFee: number;
  currency: string;
  stripeMerchantId: string;
  lessonId: string;
}

export const createChargeForLesson = async ({
  paymentMethodId,
  customerId,
  amountTotal,
  amountTransfer,
  applicationFee,
  currency,
  stripeMerchantId,
  lessonId,
}: Params) => {
  const paymentIntent = await stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    customer: customerId,
    amount: amountTotal,
    currency,
    confirmation_method: 'manual',
    confirm: true,
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: stripeMerchantId,
    },
    metadata: {
      lessonId,
    },
  });

  return paymentIntent;
};
