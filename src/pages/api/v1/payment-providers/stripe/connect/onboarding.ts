import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { PortalBody } from 'constants/payments';
import admin from 'services/server/firebase/serverless/admin';
import { getValidViewerFromToken } from 'services/server/firebase/serverless/getValidViewerFromToken';
import { updateUserStripeMerchantId } from 'services/server/graphql/mutations/updateUserStripeMerchantId';
import { getViewerById } from 'services/server/graphql/queries/getViewerById';
import { createConnectAccount } from 'services/server/stripe/createConnectAccount';
import { createConnectOnboardingSession } from 'services/server/stripe/createConnectOnboardingSession';
import { allowCors } from 'utils/server/serverless/http';
import { createErrorObject } from 'utils/server/serverless/http';

const auth = admin.auth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      try {
        const payload = req.body as PortalBody;
        const { userId } = await getValidViewerFromToken(payload.token);
        const viewer = await getViewerById(userId);

        // TODO: Check that the user is a coach
        if (!viewer) {
          return res.status(401).send(
            createErrorObject({
              message: 'Could not find valid user from session',
              statusCode: 401,
            }),
          );
        }

        let accountLinkId = viewer.stripeMerchantId || '';

        if (!accountLinkId) {
          const account = await createConnectAccount({
            email: viewer.email,
            userId,
            username: viewer.username || '',
          });
          accountLinkId = account.id;
          await updateUserStripeMerchantId({
            id: userId,
            stripeMerchantId: accountLinkId,
          });
        }

        const accountLink = await createConnectOnboardingSession(accountLinkId);

        if (!accountLink) {
          return res.status(500).send(
            createErrorObject({
              message: 'Could not create customer portal session',
              statusCode: 500,
            }),
          );
        }

        return res.status(200).json({ accountLink });
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
