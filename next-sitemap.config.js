const graphqlRequest = require('graphql-request');
const gql = require('graphql-tag');
const { print } = require('graphql/language/printer');

// Define the number of milliseconds in various time units
const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;

// Calculate total milliseconds in 180 days
const STALE_EVENT_TIME =
  180 * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR * SECONDS_IN_A_MINUTE * MILLISECONDS_IN_A_SECOND;

const VENUE_PATH_QUERY = gql`
  query getVenueSlugs {
    venues(where: { isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
      id
      slug
    }
  }
`;

const EVENT_PATH_QUERY = gql`
  query getVisibleEvents {
    events(
      where: {
        deletedAt: { _isNull: true }
        privacy: { _eq: PUBLIC }
        archivedAt: { _isNull: true }
      }
    ) {
      id
      startDate
      startDateTime
    }
  }
`;

const getClient = () => {
  let client;
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

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.APP_URL || 'https://www.bounce.game',
  generateRobotsTxt: false,
  sitemapSize: 20000,
  additionalPaths: async () => {
    const paths = [];
    const graphqlClient = getClient();
    const venuesResponse = await graphqlClient.request(print(VENUE_PATH_QUERY));
    const venues = venuesResponse.venues;
    const eventsResponse = await graphqlClient.request(print(EVENT_PATH_QUERY));
    const events = eventsResponse.events;

    venues.forEach(({ slug }) => {
      paths.push({
        loc: `/court/${slug}`,
        priority: 0.4,
        changefreq: 'daily',
      });
    });

    const staleEventTimestamp = Date.now() - STALE_EVENT_TIME;

    events.forEach((event) => {
      paths.push({
        loc: `/event/${event.id}`,
        priority: new Date(event.startDateTime).getTime() < staleEventTimestamp ? 0.3 : 0.6,
        changefreq: 'daily',
      });
    });

    return paths;
  },
};
