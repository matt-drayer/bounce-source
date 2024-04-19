import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { HOME_PAGE } from 'constants/pages';
import { updateUserOnboardStatus } from 'services/client/stripe/updateUserOnboardStatus';

const StripeOnboardReturn = () => {
  const router = useRouter();

  React.useEffect(() => {
    const handleRefresh = async () => {
      try {
        const { acct } = router.query;

        if (acct && typeof acct === 'string') {
          await updateUserOnboardStatus(acct);
        }
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        router.push(HOME_PAGE);
      }
    };

    if (router.isReady) {
      handleRefresh();
    }
  }, [router.isReady, router.query]);

  return <div>&nbsp;</div>;
};

export default StripeOnboardReturn;
