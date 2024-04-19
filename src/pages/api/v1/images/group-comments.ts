import { captureException } from '@sentry/nextjs';
import { type PageConfig } from 'next';
import { HttpMethods } from 'constants/http';
import { PostRequestPayload } from 'constants/payloads/images';
import { PostResponsePayload } from 'constants/payloads/images';
import { response500ServerError, responseJson200Success } from 'utils/server/edge/http';
import { uploadImage } from 'utils/server/edge/images';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';
import {
  type NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/edge/middleware/withViewerDataRequired';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
  runtime: 'edge',
};

const POST = async (req: NextApiRequestWithViewerRequired) => {
  try {
    const payload: PostRequestPayload = await req.formData();

    const responseData = await uploadImage(payload.get('file') as File);

    return responseJson200Success<PostResponsePayload>(req, responseData);
  } catch (e) {
    captureException(e);
    console.log(e);
    // @ts-ignore
    return response500ServerError(req, `Internal Server Error, ${e.message}`);
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
