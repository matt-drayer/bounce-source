import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { AUTH_SELECT_PAGE } from 'constants/pages';
import { useSetOnboardCompleteMutation } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import BounceLogoSplash from 'svg/BounceLogoSplash';
import Link from 'components/Link';
import Head from 'components/utilities/Head';

export default function SignupMissingCodeSuccess() {
  const viewer = useViewer();
  const [setOnboardCompleteMutation] = useSetOnboardCompleteMutation();

  React.useEffect(() => {
    if (viewer.userId) {
      setOnboardCompleteMutation({ variables: { id: viewer.userId } }).catch((error) =>
        Sentry.captureException(error),
      );
    }
  }, [viewer.userId, setOnboardCompleteMutation]);

  return (
    <>
      <Head noIndex title="Onboarding Complete" description="Start your journey with Bounce" />
      <div className="flex h-full grow flex-col bg-color-bg-darkmode-primary">
        <div className="safearea-pad-bot h-safe-screen relative flex grow flex-col">
          <div className="relative z-10 flex h-full grow flex-col">
            <div className="flex h-full flex-grow flex-col items-center justify-end px-12 pt-16 text-center">
              <BounceLogoSplash className="w-24" />
              <div className="mt-20 text-4xl font-semibold text-color-text-darkmode-primary">
                Received!
              </div>
              <div className="mt-4 text-color-text-darkmode-secondary">
                Our team has received your request. We'll be in touch shortly.
              </div>
            </div>
            <div className="mt-36 flex shrink-0 flex-col items-center px-6 pb-14 lg:mt-20 lg:pb-24">
              <Link
                className="button-rounded-full-darkmode-only lg:max-w-[240px]"
                href={AUTH_SELECT_PAGE}
              >
                Done
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
