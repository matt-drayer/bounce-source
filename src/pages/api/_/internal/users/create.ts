import Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';
import { createUser } from 'services/server/firebase/serverless/createUser';
import { insertSignupRequest } from 'services/server/graphql/mutations/insertSignupRequest';
import { getUserByEmail } from 'services/server/graphql/queries/getUserByEmail';
import {
  response400BadRequestError,
  response401UnauthorizedError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { HttpMethods, withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { toSafePhone } from 'utils/shared/phone/toSafePhone';
import { sleep } from 'utils/shared/sleep';

export const config = {
  maxDuration: 120,
};

interface NewUser {
  // Required
  email: string;
  fullName: string;
  // Useful
  shouldSendWelcomeEmail?: boolean; // Assumed to be false if not present, may be what we want for all tournaments
  welcomeEmailTemplateId?: string | null; // Not used yet
  // Nice to have
  cityId?: string;
  lat?: number;
  lng?: number;
  phoneNumber?: string;
  // Additional info
  accountType?: 'PLAYER' | 'COACH'; // PLAYER assumed if not present
  city?: string;
  state?: string;
  country?: string;
  // Likely will never use this
  password?: string;
}

// NOTE: nested may be difficult in retool
interface Payload extends NewUser {
  // user?: NewUser;
  // userList?: NewUser[];
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body as Payload;
    console.log('--- REQ BODY = ', req.body, payload, typeof payload);

    if (req.headers['retool-webhook'] !== process.env.RETOOL_INTERNAL_WEBHOOK_SECRET) {
      return response403ForbiddenError(res, 'Auth token invalid');
    }

    // if (!payload.user && (!payload.userList || payload.userList.length === 0)) {
    //   return response400BadRequestError(res, 'No user(s) in payload');
    // }

    if (payload.email) {
      // const user = payload.user;
      const user = payload;
      const email = user.email.toLowerCase();
      const name = (user.fullName || '').trim();
      const password = user.password || uuid();
      const existingUser = await getUserByEmail({ email: email });

      if (existingUser && existingUser.id) {
        return responseJson200Success(res, existingUser);
      }

      await insertSignupRequest({
        email,
        accountType: user.accountType || 'PLAYER',
        cityId: user.cityId || null,
        fullName: name,
        preferredName: name ? splitNameToFirstLast(name).firstName : '',
        phoneNumber: user.phoneNumber ? toSafePhone(user.phoneNumber) : '',
        latitude: user.lat || null,
        longitude: user.lng || null,
        city: user.city || '',
        region: user.state || '',
        country: user.country || '',
        objects: user.shouldSendWelcomeEmail
          ? []
          : [{ email, template: user.welcomeEmailTemplateId || null }],
      });

      await createUser({ email, password });

      return responseJson200Success(res, { email });
    } else {
      /**
       * @todo handle list of users
       * Insert everything in a single query instead of a "one" query and build the objects
       */
      return responseJson200Success(res, { todo: true });
    }
  } catch (error) {
    Sentry.captureException(error);

    console.log('--- ERROR = ', error);
    return response500ServerError(res, 'There was an error update the email');
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
