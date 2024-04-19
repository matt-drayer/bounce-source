import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import admin from 'services/server/firebase/serverless/admin';
import { updateStripeMerchantOnboarding } from 'services/server/graphql/mutations/updateStripeMerchantOnboarding';
import { getUserByStripeMerchantId } from 'services/server/graphql/queries/getUserByStripeMerchantId';
import { getConnectAccount } from 'services/server/stripe/getConnectAccount';
import { allowCors } from 'utils/server/serverless/http';
import { createErrorObject } from 'utils/server/serverless/http';

interface Body {
  accountId?: string;
}

const auth = admin.auth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      try {
        const payload = req.body as Body;
        const { accountId } = payload;

        if (!accountId) {
          throw new Error('No account ID');
        }

        const [graphqlResponse, account] = await Promise.all([
          getUserByStripeMerchantId({ stripeMerchantId: accountId }),
          getConnectAccount(accountId),
        ]);
        const user = graphqlResponse.users[0];

        if (!user) {
          throw new Error('handleAccountUpdated: User not found');
        }

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

        return res.status(200).json({ success: true });
      } catch (error) {
        Sentry.captureException(error);
        console.log('--- ERROR = ', error);
        return res.status(500).send(
          createErrorObject({
            message: 'There was an error. Refresh the page and try again.',
            statusCode: 500,
          }),
        );
      }
    }
    default:
      res.setHeader('Allow', [HttpMethods.Post]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default allowCors(handler);
