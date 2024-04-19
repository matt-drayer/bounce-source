import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { ExternalTournament, Tournament } from 'constants/tournaments';
import { CONFIG } from 'services/server/airtable/config';
import { externalTournamentToModel, tournamentToModel } from 'services/server/airtable/mappers';
import { fetchAllTournaments } from 'services/server/airtable/tournaments';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const [tournaments, externalTournaments] = await Promise.all([
    fetchAllTournaments<Tournament>(CONFIG.tables.tournaments, tournamentToModel),
    fetchAllTournaments<ExternalTournament>(
      CONFIG.tables.externalTournaments,
      externalTournamentToModel,
    ),
  ]);

  const tours = [...tournaments, ...externalTournaments];

  // const events = tours.map((tour) => pick(tour, ['detailsEvents', 'title']));
  const brackets = tours.map((tour) => tour.title);

  return responseJson200Success(res, brackets);
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
});
