import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { fetchPools } from 'services/server/airtable/tournaments/pools';
import { fetchTeams } from 'services/server/airtable/tournaments/teams';
import { fetchTournaments } from 'services/server/airtable/tournaments/tournaments';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const [teams, tournaments, pools] = await Promise.all([
    fetchTeams(),
    fetchTournaments(),
    fetchPools(),
  ]);

  console.log('data: ', teams, tournaments, pools);

  return responseJson200Success(res, {
    teams: teams.map(({ tournamentId, id, teamName, poolId }) => ({
      tournamentId: tournamentId?.[0],
      teamName,
      id,
    })),
    pools: pools.map(({ tournamentId, pool, airtableId, teams }) => ({
      tournamentId: tournamentId?.[0],
      pool,
      airtableId,
      teams: teams ? teams.split(', ').map((id) => +id) : [],
    })),
    tournaments: tournaments.map(({ airtableId, title }) => ({ title, airtableId })),
  });
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
});
