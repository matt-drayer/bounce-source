import Stripe from 'stripe';
import { updateStripeMerchantOnboarding } from 'services/server/graphql/mutations/updateStripeMerchantOnboarding';
import { getUserByStripeMerchantId } from 'services/server/graphql/queries/getUserByStripeMerchantId';
import { getConnectAccount } from 'services/server/stripe/getConnectAccount';

export const handleAccountUpdated = async (event: Stripe.Event) => {
  const eventAccount = event.data.object as Stripe.Account;

  if (!eventAccount) {
    throw new Error('handleAccountUpdated: Account not valid');
  }

  const accountId = eventAccount.id;
  const [graphqlResponse, account] = await Promise.all([
    getUserByStripeMerchantId({ stripeMerchantId: accountId }),
    getConnectAccount(accountId),
  ]);
  const user = graphqlResponse.users[0];

  if (!user) {
    throw new Error('handleAccountUpdated: User not found');
  }

  console.log('ACCOUNT ===', JSON.stringify(account));

  await updateStripeMerchantOnboarding({
    id: user.id,
    stripeMerchantChargesEnabled: account.charges_enabled,
    stripeMerchantCurrentlyDue: account.requirements?.currently_due || null,
    stripeMerchantDetailsSubmitted: account.details_submitted,
    stripeMerchantEventuallyDue: account.requirements?.eventually_due || null,
    stripeMerchantPastDue: account.requirements?.past_due || null,
    stripeMerchantPayoutsEnabled: account.payouts_enabled,
    stripeMerchantCountry: account.country,
    stripeMerchantBusinessType: account.business_type,
    stripeMerchantCurrency: account.default_currency,
  });

  return;
};
