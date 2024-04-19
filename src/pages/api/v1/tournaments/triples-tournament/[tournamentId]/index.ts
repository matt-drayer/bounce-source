import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import {
  GetResponsePayload,
  PostRequestPayload,
} from 'constants/payloads/tournamentsTriplesTournament';
import { MAX_TRIPLES_TEAMS } from 'constants/tournaments';
import {
  createTripleTournamentTeam,
  fetchTripleTournamentById
} from 'services/server/airtable/uniq-tournaments/triples-tournament';
import {
  response401UnauthorizedError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tournamentId } = req.query;

  try {
    const tournament = await fetchTripleTournamentById(tournamentId as string);
    return responseJson200Success<GetResponsePayload>(res, {
      tournament,
    });
  } catch (error) {
    return response500ServerError(res, 'There was an error getting the tournament');
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as PostRequestPayload;

  try {
    const tournament = await fetchTripleTournamentById(body.tournamentId) as any;

    if (
      !tournament ||
      (!!tournament?.['Triple tournament teams'] &&
        tournament?.['Triple tournament teams'].length >= MAX_TRIPLES_TEAMS)
    ) {
      return response401UnauthorizedError(res, 'The tournament is full');
    }

    await createTripleTournamentTeam(body);

    return responseJson200Success(res, {
      success: true,
    });
  } catch (error) {
    Sentry.captureException(error);
    return response500ServerError(res, 'There was an error joining the tournament');
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
  [HttpMethods.Post]: POST,
});
