import { NextApiRequest, NextApiResponse } from 'next';

export type NextLambdaHandlerFunction = (
  request: NextApiRequest,
  response: NextApiResponse,
) => unknown | Promise<unknown>;
