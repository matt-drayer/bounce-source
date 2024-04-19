import { format } from 'date-fns';
import { NextApiResponse } from 'next';
import { v4 } from 'uuid';
import { MatchDto } from 'constants/dupr';
import { HttpMethods } from 'constants/http';
import { createMatch, fetchMatches } from 'services/server/airtable/dupr';
import { authorize } from 'services/server/dupr';
import { createMatch as createMatchInDupr } from 'services/server/dupr/matches';
import { response400BadRequestError, responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const BOUNCE_DUPR_CLUB_ID = +(process.env.BOUNCE_DUPR_CLUB_ID as string);

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const body = req.body as MatchDto;

  const payload = body.payload;

  const identifier = v4();
  const date = format(new Date(payload.matchDate), 'yyyy-MM-dd');

  const {
    result: { token },
  } = await authorize();

  const duprPayload = {
    matchDate: date,
    format: payload.format,
    event: payload.duprEvent,
    identifier,
    clubId: BOUNCE_DUPR_CLUB_ID,
    matchSource: payload.matchSource,
    bracket: payload.bracket,
    location: payload.location,
    matchType: payload.matchType,
    teamA: payload.teams[0].games[0],
    teamB: payload.teams[1].games[0],
  };

  try {
    await createMatchInDupr(duprPayload, token);

    await createMatch({
      matchDate: date,
      matchType: payload.matchType,
      format: payload.format,
      matchSource: payload.matchSource,
      bracket: payload.bracket,
      location: payload.location,
      identifier,
      clubId: BOUNCE_DUPR_CLUB_ID,
      event: payload.duprEvent,
      teams: payload.teams.map((team) => ({
        ...team,
        games: team.games[0],
      })),
    });

    return responseJson200Success(res, {
      success: true,
    });
  } catch (e: any) {
    return response400BadRequestError(res, e.response.data);
  }
};

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const matches = await fetchMatches();

  return responseJson200Success(res, matches);
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
  [HttpMethods.Get]: GET,
});
