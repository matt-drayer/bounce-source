import { PostHog } from 'posthog-node';

const HOST = 'https://app.posthog.com';

export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.POSTHOG_KEY!, {
    host: HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
