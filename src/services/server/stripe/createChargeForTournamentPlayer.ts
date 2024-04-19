import stripe from 'services/server/stripe/instance';

interface Params {
  paymentMethodId: string;
  customerId: string;
  amount: number;
  currency: string;
  tournamentId: string;
  platformFee?: number;
  stripeMerchantId?: string | null;
  events: { groupId: string; index: number }[];
  registrationFee: number;
}

export const createChargeForTournamentPlayer = async (
  {
    paymentMethodId,
    customerId,
    amount,
    currency,
    tournamentId,
    platformFee,
    events,
    stripeMerchantId,
  }: Params,
  overrides: Record<string, any> = {},
) => {
  return stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    customer: customerId,
    amount,
    currency,
    confirm: true,
    ...(stripeMerchantId
      ? {
          transfer_data: {
            destination: stripeMerchantId,
          },
        }
      : {}),
    ...(platformFee && stripeMerchantId ? { application_fee_amount: platformFee } : {}),
    metadata: {
      tournamentId,
      events: JSON.stringify(events),
      platformFee: platformFee || 0,
    },
    ...overrides,
  });
};
