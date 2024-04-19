import Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { changeEmail } from 'services/server/brevo';
import { changeFirebaseEmail } from 'services/server/firebase/serverless/changeFirebaseEmail';
import { getFirebaseUserByEmail } from 'services/server/firebase/serverless/getFirebaseUserByEmail';
import { setEmailAddressVerified } from 'services/server/firebase/serverless/setEmailAddressVerified';
import { changeUserEmail } from 'services/server/graphql/mutations/changeUserEmail';
import { getUserByEmail } from 'services/server/graphql/queries/getUserByEmail';
import changeCustomerEmail from 'services/server/stripe/changeCustomerEmail';
import {
  response401UnauthorizedError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { HttpMethods, withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';

interface Payload {
  oldEmail: string;
  newEmail: string;
  internalToken: string;
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body as Payload;
    console.log('--- REQ BODY = ', req.body, payload, typeof payload);

    if (req.headers['retool-webhook'] !== process.env.RETOOL_INTERNAL_WEBHOOK_SECRET) {
      return response403ForbiddenError(res, 'Auth token invalid');
    }

    if (!payload.oldEmail || !payload.newEmail) {
      return response403ForbiddenError(res, 'No emails');
    }

    const [firebaseUser, databaseUser] = await Promise.all([
      getFirebaseUserByEmail(payload.oldEmail),
      getUserByEmail({ email: payload.oldEmail }),
    ]);

    if (!firebaseUser || !databaseUser) {
      return response401UnauthorizedError(res, 'Firebase or database did not return a user');
    }
    if (firebaseUser.uid !== databaseUser.firebaseId) {
      return response401UnauthorizedError(
        res,
        'Firebase user did not have same id as database user',
      );
    }

    await changeUserEmail({ id: databaseUser.id, email: payload.newEmail });
    await changeFirebaseEmail({ oldEmail: payload.oldEmail, newEmail: payload.newEmail });
    await setEmailAddressVerified(payload.newEmail);
    await changeCustomerEmail({ id: databaseUser.stripeCustomerId, email: payload.newEmail });
    await changeEmail({ oldEmail: payload.oldEmail, newEmail: payload.newEmail });

    return responseJson200Success(res, { success: true });
  } catch (error) {
    Sentry.captureException(error);

    console.log('--- ERROR = ', error);
    return response500ServerError(res, 'There was an error update the email');
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
