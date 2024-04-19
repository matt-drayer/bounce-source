import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { allowCors } from 'utils/server/serverless/http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Post: {
      return res.status(200).json({
        success: true,
      });
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Post]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default allowCors(handler);
