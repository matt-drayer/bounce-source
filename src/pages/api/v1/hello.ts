import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Get: {
      return res.status(200).json({
        success: true,
      });
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Get]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default handler;
