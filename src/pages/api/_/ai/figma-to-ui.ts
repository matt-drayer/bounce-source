import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods, withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json({ test: true });
  } catch (error) {
    console.error('AI gen error:', error);
    return res.status(500).json({ error: 'Error' });
  }
}

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
