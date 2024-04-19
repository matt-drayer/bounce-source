import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import { HttpMethods } from 'constants/http';
import { GetResponsePayload } from 'constants/payloads/tourmaments';
import { fetchTournaments } from 'services/server/airtable/edge';
import { response500ServerError, responseJson200Success } from 'utils/server/edge/http';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';

export const config = {
  runtime: 'edge',
};

const GET = async (req: NextRequest) => {
  try {
    const tournaments = await fetchTournaments();

    const formattedTournaments = tournaments.map((tournament) => ({
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      title: tournament.title,
      id: tournament.airtableId,
      slug: tournament.slug,
      registrationFee: tournament.registrationFee || 0,
      location: tournament.city,
      gender: tournament.group,
      appImageUrl: tournament.appImageUrl,
    }));

    return responseJson200Success<GetResponsePayload>(req, {
      tournaments: formattedTournaments,
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return response500ServerError(req, 'There was an error getting tournaments');
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
});
