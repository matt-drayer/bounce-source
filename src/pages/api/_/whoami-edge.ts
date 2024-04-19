import { geolocation, ipAddress } from '@vercel/edge';
import { NextResponse } from 'next/server';
import { cors } from 'utils/server/edge/cors';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/edge/middleware/withViewerDataRequired';

export const config = {
  runtime: 'edge',
};

const handler = async (request: NextApiRequestWithViewerRequired) => {
  const ip = ipAddress(request) || 'unknown';
  const geo = geolocation(request);

  console.log(request.auth);

  if (!request.auth) {
    return cors(
      request,
      NextResponse.json({
        userId: '',
        ip,
        ...geo,
      }),
    );
  }

  const userId = request?.viewer?.id;
  console.log('++++++++++++++', { userId });

  return cors(
    request,
    NextResponse.json({
      userId,
      ip,
      ...geo,
    }),
  );
};

export default withViewerDataRequired(handler);
