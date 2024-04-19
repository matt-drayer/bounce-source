import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers['authorization'];

  if (!authHeader?.includes(process.env.PICKLEBALLGPT_API_KEY || '')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    return res.status(200).json({
      todo: true,
    });
  } catch (error) {
    console.error('Error in Geocoding API call:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
