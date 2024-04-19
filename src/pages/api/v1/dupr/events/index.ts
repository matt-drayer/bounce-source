import { uniqBy } from 'lodash';
import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { fetchMultipleEventTeams } from 'services/server/airtable/uniq-tournaments/external-tournaments';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const data = await fetchMultipleEventTeams().then((events) =>
    events.map((event) => ({
      poolName: event.poolName,
      bracket: event.tournamentName,
    })),
  );

  return responseJson200Success(res, uniqBy(data, 'poolName'));
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
});
