import { NextRequest } from 'next/server';
import { HttpMethods } from 'constants/http';
import { PostRequestPayload } from 'constants/payloads/championWaitlist';
import { responseJson200Success } from 'utils/server/edge/http';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';

export const config = {
  runtime: 'edge',
};

const POST = async (req: NextRequest) => {
  const payload = (await req.json()) as PostRequestPayload;

  await fetch('https://eo73jcnd9j11cn2.m.pipedream.net', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return responseJson200Success(req, {
    success: true,
  });
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
