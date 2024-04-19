const { withSentryConfig } = require('@sentry/nextjs');

const date = new Date();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turned this off because of bottom sheet component. Do I actually need it?
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  staticPageGenerationTimeout: 120,
  // NOTE: Not compatible with next export
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.bounceassets.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '**',
      },
      /**
       * @todo once we're hosting ourselves
       */
      {
        protocol: 'https',
        hostname: 'pickleballbrackets.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  env: {
    APP_STAGE: process.env.APP_STAGE,
    TARGET_PLATFORM: process.env.TARGET_PLATFORM,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
    ROOT_URL: process.env.ROOT_URL,
    APP_URL: process.env.APP_URL,
    REMOTE_API_URL: process.env.REMOTE_API_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL: process.env.IMAGEKIT_URL,
    IMAGEKIT_ENV: process.env.IMAGEKIT_ENV,
    VIRTUAl_CONSOLE_DEFAULT_ENABLED: process.env.VIRTUAl_CONSOLE_DEFAULT_ENABLED,
    CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_MAP_ID: process.env.GOOGLE_MAPS_MAP_ID,
    GOGOLE_ANALYTICS_TAG: process.env.GOGOLE_ANALYTICS_TAG,
    SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
    INTERCOM_APP_ID: process.env.INTERCOM_APP_ID,
    CLOUDFLARE_PUBLIC_URL: process.env.CLOUDFLARE_PUBLIC_URL,
    POSTHOG_KEY: process.env.POSTHOG_KEY,
    POSTHOG_API_HOST: process.env.POSTHOG_API_HOST,
    POSTHOG_UI_HOST: process.env.POSTHOG_UI_HOST,
  },
  async rewrites() {
    return [
      {
        source: '/lytics/:path*',
        destination: 'https://app.posthog.com/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/play.bounce',
        permanent: false,
        basePath: false,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/company/playbounce',
        permanent: false,
        basePath: false,
      },
      {
        source: '/tiktok',
        destination: 'https://www.tiktok.com/@bounce.game0',
        permanent: false,
        basePath: false,
      },
      {
        source: '/facebook',
        destination: 'https://www.facebook.com/profile.php?id=61550012866223',
        permanent: false,
        basePath: false,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/channel/UCr5m5LHXed76e1E7EFOopXw?sub_confirmation=1',
        permanent: false,
        basePath: false,
      },
      {
        source: '/tournaments',
        destination: '/',
        permanent: true,
        basePath: false,
      },
      {
        source: '/bounce-brackets',
        destination: '/tournament-software',
        permanent: true,
        basePath: false,
      },
    ];
  },
};
console.log('+++++++ NEXT CONFIG **********');
console.log('+++++++ NEXT CONFIG **********');
console.log('+++++++ NEXT CONFIG **********');
console.log('+++++++ NEXT CONFIG **********');
console.log(nextConfig);
const sentryWebpackPluginOptions = {
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
