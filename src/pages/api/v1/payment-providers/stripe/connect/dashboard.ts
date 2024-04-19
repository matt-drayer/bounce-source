import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { PortalBody } from 'constants/payments';
import admin from 'services/server/firebase/serverless/admin';
import { getValidViewerFromToken } from 'services/server/firebase/serverless/getValidViewerFromToken';
import { getViewerById } from 'services/server/graphql/queries/getViewerById';
import { createConnectLoginLink } from 'services/server/stripe/createConnectLoginLink';
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

        if (!viewer || !viewer.stripeCustomerId || !viewer.stripeMerchantId) {
          return res.status(401).send(
            createErrorObject({
              message: 'Could not find valid user from session',
              statusCode: 401,
            }),
          );
        }

        const loginLink = await createConnectLoginLink(viewer.stripeMerchantId);
        console.log('loginLink: ', loginLink);

        if (!loginLink) {
          return res.status(500).send(
            createErrorObject({
              message: 'Could not create customer portal session',
              statusCode: 500,
            }),
          );
        }

        return res.status(200).json({ loginLink });
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
