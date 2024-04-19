import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import stripe, { API_VERSION } from 'services/server/stripe/instance';
import {
  createErrorObject,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { HttpMethods, withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  return responseJson200Success(res, {
    up: Date.now(),
  });
};

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  try {
    const viewer = req.viewer;

    if (!viewer) {
      return res.status(401).send(
        createErrorObject({
          message: 'Could not find valid user from session',
          statusCode: 401,
        }),
      );
    }

    const setupIntentPromise = stripe.setupIntents.create({
      customer: viewer.stripeCustomerId,
      payment_method_types: ['card'],
    });
    const ephemeralKeyPromise = stripe.ephemeralKeys.create(
      { customer: viewer.stripeCustomerId },
      { apiVersion: API_VERSION },
    );

    const [setupIntent, ephemeralKey] = await Promise.all([
      setupIntentPromise,
      ephemeralKeyPromise,
    ]);

    return responseJson200Success(res, {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      ephemeralKey: ephemeralKey.secret,
      setupIntentClientSecret: setupIntent.client_secret,
      customerId: viewer.stripeCustomerId,
    });
  } catch (error) {
    Sentry.captureException(error);

    console.log('--- ERROR = ', error);
    return response500ServerError(res, 'There was an error. Refresh the page and try again.');
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
