import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { response405InvalidMethodError } from 'utils/server/serverless/http';
import { NextApiRequestWithViewerRequired } from './withViewerDataRequired';

export { HttpMethods };

export const withHttpMethods =
  (handlers: any) =>
  async (req: NextApiRequest | NextApiRequestWithViewerRequired, res: NextApiResponse) => {
    const method = req.method as HttpMethods | undefined;

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    );

    if (!method) {
      return response405InvalidMethodError(res, `Method ${method} not allowed`);
    }

    if (method === HttpMethods.Options) {
      return res.status(200).end();
    }

    const handler = handlers[method];
    if (!handler) {
      return response405InvalidMethodError(res, `Method ${method} not allowed`);
    }

    return handler(req, res);
  };
