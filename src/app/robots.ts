import { MetadataRoute } from 'next';

/**
 * @note this is a special route type for Next.js
 */

const PROD_ROBOTS = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/api', '/_next'],
  },
};

const DEV_ROBOTS = {
  rules: {
    userAgent: '*',
    disallow: ['/', '/_next', '/api'],
  },
};

export default function robots(): MetadataRoute.Robots {
  const robotsFile = process.env.APP_STAGE === 'production' ? PROD_ROBOTS : DEV_ROBOTS;

  return robotsFile;
}
