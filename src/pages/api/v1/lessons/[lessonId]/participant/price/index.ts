import { geolocation, ipAddress } from '@vercel/edge';
import { NextRequest, NextResponse } from 'next/server';
import { cors } from 'utils/server/edge/cors';

export const config = {
  runtime: 'edge',
};

const handler = function (request: NextRequest) {
  // TODO: Allow cors. Pass in lesson ID to params and read their user ID from header (may need to allow headers in CORS - look at current version).

  const ip = ipAddress(request) || 'unknown';
  const geo = geolocation(request);

  return cors(
    request,
    NextResponse.json({
      ip,
      ...geo,
    }),
  );
};

export default handler;
