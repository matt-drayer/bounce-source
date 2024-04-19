import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { MediaProviders } from 'constants/media';
import { getAuthenticationParameters } from 'services/server/imagekit/getAuthenticationParameters';
import { allowCors } from 'utils/server/serverless/http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethods.Get: {
      const authenticationParameters = getAuthenticationParameters();

      // TODO: Any authentication?

      return res.status(200).json({
        source: MediaProviders.ImageKit,
        ...authenticationParameters,
      });
    }
    default: {
      res.setHeader('Allow', [HttpMethods.Get]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
};

export default allowCors(handler);
