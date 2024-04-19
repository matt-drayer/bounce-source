const path = require('path');
const envPathProd = path.join(__dirname, '../../.env.production');
const envPathDev = path.join(__dirname, '../../.env.development');
const envPath = process.env.NODE_ENV === 'production' ? envPathProd : envPathDev;
require('dotenv').config({ path: envPath });
const graphqlRequest = require('graphql-request');

global.Headers = global.Headers;

let client;

const getClient = () => {
  const url = process.env.GRAPHQL_URL;
  const secret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

  if (!client) {
    client = new graphqlRequest.GraphQLClient(url, {
      headers: {
        'x-hasura-admin-secret': secret,
      },
    });
  }

  return client;
};

module.exports = getClient;
