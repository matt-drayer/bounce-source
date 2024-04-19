import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import {
  createRegistrant,
  fetchExternalTournamentTeamByUserBounceId,
} from 'services/server/airtable/uniq-tournaments/external-tournaments';
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
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { TournamentRequirements } from 'components/tournaments/ExternalTournament/RegisterForm';

type Payload = {
  requirements: TournamentRequirements;
  tournamentId: string;
  providerCardId: string;
};

export const payForExternalTournament = async (
  req: NextApiRequestWithViewerRequired,
  res: NextApiResponse,
) => {
  try {
    const { requirements, tournamentId, providerCardId } = req.body as Payload;

    const viewer = req.viewer;

    console.log('PAY FOR TOURNAMENT PAYLOAD', req.body);

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
      amount: requirements.amount,
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
        tournamentId: tournamentId as string,
        // @ts-ignore
        gender: viewer.gender,
        chargeId: paymentIntent.charges?.data[0].id as string,
        requirements,
      };

      console.log('CREATE REGISTRANT PAYLOAD', createRegistrantPayload);

      let duprInfo;

      if (requirements.duprId) {
        try {
          duprInfo = await fetchDuprInfo(requirements.duprId);
        } catch (e) {}
      }

      await createRegistrant({ ...createRegistrantPayload, duprInfo });

      return responseJson200Success(res, {
        success: true,
      });
    }

    return response400BadRequestError(res, paymentIntent.last_payment_error?.message as string);
  } catch (e) {
    Sentry.captureException(e);
    return response500ServerError(res, 'Internal server error');
  }
};

export const fetchTeamForExternalTournament = async (
  req: NextApiRequestWithViewerRequired,
  res: NextApiResponse,
  slug: string,
) => {
  const viewer = req.viewer;

  const team = await fetchExternalTournamentTeamByUserBounceId(viewer.id, slug);

  return responseJson200Success(res, {
    team,
    success: true,
  });
};
