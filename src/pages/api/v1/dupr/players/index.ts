import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { ExternalRegistrant, Registrant } from 'constants/tournaments';
import { CONFIG } from 'services/server/airtable/config';
import { externalRegistrantToModel, registrantToModel } from 'services/server/airtable/mappers';
import { fetchRegistrants } from 'services/server/airtable/tournaments';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const [externalRegistrants, registrants] = await Promise.all([
    fetchRegistrants<ExternalRegistrant>(
      CONFIG.tables.externalTournamentsRegistrants,
      externalRegistrantToModel,
    ),
    fetchRegistrants<Registrant>(CONFIG.tables.registrants, registrantToModel),
  ]);

  return responseJson200Success(
    res,
    [...registrants, ...externalRegistrants].map((registrant) => ({
      fullName: `${registrant.firstName} ${registrant.lastName}`,
      duprId: registrant.duprId,
      bracket: registrant.tournamentTitle,
    })),
  );
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
});
