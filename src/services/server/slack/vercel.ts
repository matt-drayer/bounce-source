import * as Sentry from '@sentry/nextjs';

export const sendErrorToTheChannel = async (message: string) => {
  if (process.env.APP_STAGE === 'production' || process.env.APP_STAGE === 'staging') {
    await fetch('https://eo9hjnd1d0tgm4y.m.pipedream.net', {
      method: 'POST',
      body: JSON.stringify({
        message,
      }),
    }).catch((e) => Sentry.captureException(e));
  }
};
