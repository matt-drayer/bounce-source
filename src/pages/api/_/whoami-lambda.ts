import { NextApiRequest, NextApiResponse } from 'next';
// import {
//   NextApiRequestWithAuthOptional,
//   withAuthOptionalLambda,
// } from 'utils/server/serverless/middleware/withAuthOptional';
import {
  NextApiRequestWithViewerOptional,
  withViewerDataOptional,
} from 'utils/server/serverless/middleware/withViewerDataOptional';

const handler = async (request: NextApiRequestWithViewerOptional, response: NextApiResponse) => {
  console.log('REQUEST HANDLER', request.auth, request.viewer);

  return response.status(200).json(request.viewer);
};

export default withViewerDataOptional(handler);
