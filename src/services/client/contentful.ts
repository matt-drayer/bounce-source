const contentful = require('contentful');

export const getClient = () => {
  return contentful.createClient({
    space: process.env.CONTENTFUL_SPACE as string,
    environment: 'master',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  });
};
