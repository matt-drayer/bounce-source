import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { getVenueBySlug } from 'services/server/graphql/queries/getVenueBySlug';
import { response500ServerError, responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const GET = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const viewer = req.viewer;
  const { venueSlug } = req.query as { venueSlug: string };

  try {
    const {
      venues: [venue],
    } = await getVenueBySlug({ slug: venueSlug });

    return responseJson200Success(res, venue || null);
  } catch (error) {
    return response500ServerError(res, 'There was an error during registration');
  }
};

export default withHttpMethods({
  [HttpMethods.Get]: GET,
  // [HttpMethods.Get]: withViewerDataRequired(GET),
});
