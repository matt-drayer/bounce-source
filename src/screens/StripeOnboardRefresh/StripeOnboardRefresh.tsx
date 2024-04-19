import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE, LOGIN_PAGE, STRIPE_ONBOARD_REFRESH } from 'constants/pages';
import { initializeConnectOnboarding } from 'services/client/stripe/initializeConnectOnboarding';
import { useViewer } from 'hooks/useViewer';

const StripeOnboardRefresh = () => {
  const viewer = useViewer();
  const router = useRouter();

  React.useEffect(() => {
    const handleOnboard = async () => {
      if (viewer.status === AuthStatus.User) {
        try {
          const idToken = await viewer.viewer?.getIdToken(true);

          if (!idToken) {
            throw new Error('You must be logged in to add payout details');
          }

          const { accountLink } = await initializeConnectOnboarding(idToken);
          window.location.href = accountLink.url;
        } catch (error) {
          Sentry.captureException(error);
          router.push(HOME_PAGE);
        }
      } else if (viewer.status === AuthStatus.Anonymous) {
        router.push(`${LOGIN_PAGE}?next=${encodeURIComponent(STRIPE_ONBOARD_REFRESH)}`);
      }
    };

    handleOnboard();
  }, [viewer.status]);

  return <div>&nbsp;</div>;
};

export default StripeOnboardRefresh;
