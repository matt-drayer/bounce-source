import * as React from 'react';
import { COACH_ONBOARDING_STEPS, PLAYER_ONBOARDING_STEPS } from 'constants/pages';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import Link from 'components/Link';
import Head from 'components/utilities/Head';

interface Props {
  isCoach?: boolean;
}

const OnboardStart: React.FC<Props> = ({ isCoach }) => {
  // NOTE: Prime cache and memory storage
  useGetCurrentUser();

  return (
    <>
      <Head noIndex title="Onboarding" description="Begin Onboarding" />
      <div className="flex h-full grow flex-col bg-color-bg-darkmode-primary">
        <div className="safearea-pad-bot h-safe-screen relative flex grow flex-col">
          <div className="absolute left-0 top-0 lg:hidden">
            <img src="/images/logo/planets-separate-mobile.svg" className="w-screen" />
          </div>
          <div className="absolute   hidden w-full justify-center lg:flex">
            <img src="/images/logo/planets-separate-desktop.svg" className="w-screen" />
          </div>
          <div className="relative z-10 flex h-full grow flex-col">
            <div className="flex h-full flex-grow flex-col items-center justify-end pt-16 text-center">
              <div className="mt-2 text-4xl font-semibold text-color-text-darkmode-primary">
                Congratulations!
              </div>
              <div className="mt-4 text-color-text-darkmode-secondary">
                <div>You have successfully registered</div>
              </div>
            </div>
            <div className="mt-36 flex shrink-0 flex-col items-center px-6 pb-14 lg:mt-20 lg:pb-24">
              <Link
                href={isCoach ? COACH_ONBOARDING_STEPS[0].url : PLAYER_ONBOARDING_STEPS[0].url}
                className="button-rounded-full-darkmode-only lg:max-w-[240px]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardStart;
