import type { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';

const DINK_RSS_URL = 'https://www.thedinkpickleball.com/rss/';
const MAX_ARTICLES = 5;

async function fetchRSSFeed(url: string): Promise<any> {
  const response = await fetch(url);
  const rssText = await response.text();
  return parseStringPromise(rssText, { explicitArray: false, mergeAttrs: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const rssData = await fetchRSSFeed(DINK_RSS_URL);

      // @ts-ignore
      const cleanedRssItems = rssData.rss.channel.item.map((item) => {
        return {
          ...item,
          'content:encoded': undefined,
        };
      });

      rssData.rss.channel.item = cleanedRssItems.slice(0, MAX_ARTICLES);

      return res.status(200).json(rssData);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('RSS Fetch Error:', error);
    return res.status(500).json({ error: 'Error fetching RSS feed' });
  }
}
