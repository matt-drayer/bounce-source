import * as React from 'react';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE, SIGNUP_CODE_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import NameFire from 'svg/NameFire';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const AuthSelectType: React.FC = () => {
  const viewer = useViewer();
  const isHidden = viewer.status === AuthStatus.Loading || viewer.status === AuthStatus.User;

  return (
    <>
      <Head title="Welcome" description="Sign up for Bounce" />
      <div className="flex h-full grow flex-col bg-color-bg-darkmode-primary">
        <div className="safearea-pad-bot h-safe-screen relative flex grow flex-col overflow-hidden">
          <div className="relative z-10 flex h-full grow flex-col">
            <div className="relative flex h-full grow flex-col items-center justify-center">
              <div className="text-5xl font-semibold text-color-text-darkmode-primary">
                <NameFire className="h-14" />
              </div>
              <div className="mt-8 text-color-text-darkmode-secondary">Hit different.</div>
            </div>
            <div className="mt-16 flex w-full justify-center">
              <div
                className={classNames(
                  'flex w-full max-w-[520px] shrink-0 flex-col space-y-6 px-6 pb-14 transition-opacity duration-700 lg:flex-row lg:justify-center lg:space-x-8 lg:space-y-0 lg:pb-28',
                  isHidden ? 'opacity-0' : 'opacity-100',
                )}
              >
                <Link href={SIGNUP_CODE_PAGE} className="button-rounded-full-darkmode-only">
                  Sign up
                </Link>
                <Link href={LOGIN_PAGE} className="button-rounded-full-background-bold">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthSelectType;
