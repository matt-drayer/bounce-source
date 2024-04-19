import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { PostRequestPayload } from 'constants/payloads/tournamentsPay';
import { createRegistrant } from 'services/server/airtable/tournaments';
import { BrevoAttributes, addUserToTournamentList } from 'services/server/brevo';
import { fetchDuprInfo } from 'services/server/dupr';
import { createChargeForTournamentPlayer } from 'services/server/stripe/createChargeForTournamentPlayer';
import { getCustomerIdFromObject } from 'services/server/stripe/getCustomerIdFromObject';
import { getPaymentMethodById } from 'services/server/stripe/getPaymentMethodById';
import {
  response400BadRequestError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  try {
    const { providerCardId, amount, partnerEmail, duprId, brevoListId } =
      req.body as PostRequestPayload;
    const { tournamentId } = req.query;
    const viewer = req.viewer;

    if (!providerCardId) {
      const ERROR = 'No payment method';
      Sentry.captureException(new Error(ERROR));
      return response400BadRequestError(res, ERROR);
    }

    const stripePaymentMethod = await getPaymentMethodById(providerCardId);
    const stripeCustomerId = getCustomerIdFromObject(stripePaymentMethod);

    if (!stripePaymentMethod) {
      const ERROR = 'No valid payment method';
      Sentry.captureException(new Error(ERROR));
      return response400BadRequestError(res, ERROR);
    }
    if (viewer?.stripeCustomerId !== stripeCustomerId) {
      const ERROR = 'Stripe customer did not match';
      Sentry.captureException(new Error(ERROR));
      return response403ForbiddenError(res, ERROR);
    }

    const paymentIntent = await createChargeForTournamentPlayer({
      tournamentId: tournamentId as string,
      amount,
      currency: 'usd',
      customerId: stripeCustomerId,
      paymentMethodId: stripePaymentMethod.id,
      registrationFee: 0,
      events: [],
    });

    if (paymentIntent.status === 'succeeded') {
      const createRegistrantPayload = {
        // data related to player account
        username: viewer.username as string,
        viewerId: viewer.id,
        firstName: splitNameToFirstLast(viewer.fullName).firstName,
        lastName: splitNameToFirstLast(viewer.fullName).lastName,
        email: viewer.email,
        duprId,
        tournamentId: tournamentId as string,
        partnerEmail,
        // @ts-ignore
        gender: viewer.gender,
        duprConfirmation: false,
        chargeId: paymentIntent.charges?.data[0].id as string,
      };

      console.log('CREATE REGISTRANT PAYLOAD', createRegistrantPayload);

      let duprInfo;

      if (duprId) {
        try {
          duprInfo = await fetchDuprInfo(duprId);
        } catch (e) {
          Sentry.captureException(e);
        }
      }

      await Promise.all([
        createRegistrant({ ...createRegistrantPayload, duprInfo }),
        addUserToTournamentList({
          email: viewer.email,
          listIds: [brevoListId],
          attributes: {
            [BrevoAttributes.FirstName]: splitNameToFirstLast(viewer.fullName).firstName,
            [BrevoAttributes.LastName]: splitNameToFirstLast(viewer.fullName).lastName,
          },
        }),
      ]);

      return responseJson200Success(res, {
        success: true,
      });
    } else {
      console.log('payment error: ', paymentIntent.last_payment_error?.message);
      return response400BadRequestError(res, paymentIntent.last_payment_error?.message as string);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.log('error: ', error);
    return response500ServerError(res, 'There was an error processing your payment');
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
