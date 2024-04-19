import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { fetchTeamByUserBounceId } from 'services/server/airtable/tournaments';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const { tournamentId } = req.query;
  const viewer = req.viewer;

  const team = await fetchTeamByUserBounceId(viewer.id, tournamentId as string);

  return responseJson200Success(res, {
    team,
  });
};

export default withHttpMethods({
  [HttpMethods.Get]: withViewerDataRequired(GET),
});
