import { geolocation, ipAddress } from '@vercel/edge';
import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken } from 'services/server/firebase/edge/getBearerToken';
import { getValidViewerFromToken } from 'services/server/firebase/edge/getValidViewerFromToken';
import { cors } from 'utils/server/edge/cors';

export const config = {
  runtime: 'edge',
};

const handler = async (request: NextRequest) => {
  const ip = ipAddress(request) || 'unknown';
  const geo = geolocation(request);
  const token = getBearerToken(request);

  console.log(request.headers.get('authorization'), { token });

  if (!token) {
    return cors(
      request,
      NextResponse.json({
        userId: '',
        ip,
        ...geo,
      }),
    );
  }

  const { userId } = await getValidViewerFromToken(token);
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

export default handler;
