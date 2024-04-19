import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { reindexDuprInfo } from 'services/server/dupr';
import { response400BadRequestError, responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  try {
    await reindexDuprInfo();

    return responseJson200Success(res, {
      success: true,
    });
  } catch (e) {
    return response400BadRequestError(res, JSON.stringify(e));
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
