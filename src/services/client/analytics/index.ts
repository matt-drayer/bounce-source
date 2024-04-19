import * as Sentry from '@sentry/nextjs';
import posthog from 'services/client/analytics/posthog';

const IS_PRODUCTION_ONLY = true;
const isProduction = process.env.APP_STAGE === 'production';

const isAnalyticsEnabled = () => {
  if (IS_PRODUCTION_ONLY) return isProduction;
  return true;
};

export const logPageview = () => {
  if (isAnalyticsEnabled()) {
    // Does this happen automatically for posthog?
    posthog.capture('$pageview');
  }
};

interface IdentifyParams {
  userId: string;
  email?: string;
  name?: string;
  additionalUserParams: object;
}
export const identify = (params: IdentifyParams) => {
  if (!params.userId || !isAnalyticsEnabled()) return;

  const { userId, email, name, additionalUserParams } = params;
  posthog.identify(userId, {
    ...additionalUserParams,
    email,
    name,
  });
  Sentry.setUser({ id: userId });
};

export const reset = () => {
  if (isAnalyticsEnabled()) {
    posthog.reset();
    Sentry.setUser(null);
  }
};

export const trackEvent = (eventName: string, eventParams: object) => {
  if (isAnalyticsEnabled()) {
    posthog.capture(eventName, eventParams);
  }
};
