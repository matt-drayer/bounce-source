import { NextRouter } from 'next/router';

export const pageBackOrFallback = ({
  router,
  fallbackPath = '/',
}: {
  router: NextRouter;
  fallbackPath: string;
}) => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    router.push(fallbackPath);
  }
};
