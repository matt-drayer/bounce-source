import posthog from 'posthog-js';

if (typeof window !== 'undefined' && process.env.APP_STAGE === 'production') {
  console.log('====== LOADING POSTHOG ======');
  posthog.init(process.env.POSTHOG_KEY!, {
    api_host: process.env.POSTHOG_API_HOST!,
    ui_host: process.env.POSTHOG_UI_HOST!,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export default posthog;
