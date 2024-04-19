import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { CHAMPION_WAITLIST_PAGE, HOME_PAGE, LOGIN_PAGE, SIGNUP_PAGE } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { useGetGroupByAccessCodeLazyQuery } from 'types/generated/client';
import { auth } from 'services/client/firebase';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { useViewer } from 'hooks/useViewer';
import LogoWithName from 'svg/LogoWithName';
import AuthPage from 'layouts/AuthPage';
import AuthSideContent from 'layouts/AuthPage/AuthSideContent';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

export default function SignupCode() {
  const router = useRouter();
  const viewer = useViewer();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [groupCode, setGroupCode] = React.useState('');
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const [
    getGroupByAccessCodeLazyQuery,
    { loading: isLoadingGetGroupByAccessCodeLazyQuery, error: errorGetGroupByAccessCodeLazyQuery },
  ] = useGetGroupByAccessCodeLazyQuery();
  const isDisabled =
    requestStatus === RequestStatus.InProgress || isLoadingGetGroupByAccessCodeLazyQuery;
  const isHidden =
    !getIsNativePlatform() &&
    (viewer.status === AuthStatus.Loading || viewer.status === AuthStatus.User) &&
    !error &&
    requestStatus !== RequestStatus.InProgress &&
    requestStatus !== RequestStatus.Success;

  React.useEffect(() => {
    const isIdle =
      requestStatus !== RequestStatus.InProgress && requestStatus !== RequestStatus.Success;
    const hasViewer = viewer.status === AuthStatus.User && viewer.viewer;

    if (hasViewer && isIdle) {
      const next = router.query.next as string;
      const redirectUrl = next || HOME_PAGE;
      router.push(redirectUrl);
    }
  }, [viewer, requestStatus]);

  return (
    <>
      <Head noIndex title="Group access code" description="Sign up with a group access code" />
      <AuthPage
        sideContent={
          <AuthSideContent
            imageSrc="/images/app/players-one.svg"
            title="Get in the game"
            description="Enter your group's access code to get started. No code? Ask your group for an invite link."
          />
        }
      >
        <form
          className="h-safe-screen flex grow flex-col items-center lg:justify-center"
          onSubmit={async (e) => {
            e.preventDefault();

            if (
              requestStatus === RequestStatus.InProgress ||
              requestStatus === RequestStatus.Success
            ) {
              return;
            }

            setRequestStatus(RequestStatus.InProgress);
            setError(null);

            const response = await getGroupByAccessCodeLazyQuery({
              variables: {
                accessCode: groupCode,
              },
            });

            const isValidGroup = (response?.data?.groups?.length || 0) >= 1;

            if (isValidGroup) {
              setRequestStatus(RequestStatus.Success);
              router.push(`${SIGNUP_PAGE}?code=${groupCode}`);
            } else {
              setRequestStatus(RequestStatus.Idle);
              toast.error(
                'No group found for that code. Try again or ask your group champion for an invite link.',
              );
            }
          }}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto lg:h-auto lg:max-w-[408px] lg:grow-0">
            <h1 className="flex shrink-0 items-center justify-center space-x-4 px-6 pt-16">
              <span className="text-2xl font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                <LogoWithName className="h-7" />
              </span>
            </h1>
            <h2 className="mb-6 mt-6 text-2xl lg:mt-10">Create your account</h2>
            <div
              className={classNames(
                'flex h-full w-full grow flex-col items-center justify-center overflow-y-auto px-6 transition-opacity duration-700',
                isHidden ? 'opacity-0' : 'opacity-100',
              )}
            >
              <div className="flex w-full flex-col space-y-8">
                <div className="w-full py-2">
                  <label
                    className="mb-4 block text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                    htmlFor="group-code"
                  >
                    Group access code
                  </label>
                  <input
                    id="group-code"
                    name="group-code"
                    type="text"
                    autoComplete="group-code"
                    autoCapitalize="characters"
                    value={groupCode}
                    disabled={isDisabled}
                    onChange={(e) => setGroupCode(e.target.value.toUpperCase().trim())}
                    placeholder="Enter your group's code"
                    className="input-form py-3 text-center text-lg"
                    required
                  />
                </div>
              </div>
            </div>
            <div
              className={classNames(
                'w-full shrink-0 px-6 pb-14 transition-opacity duration-700 lg:mt-16 lg:max-w-[408px]',
                isHidden ? 'opacity-0' : 'opacity-100',
              )}
            >
              <div className="mb-6 text-center">
                <Link
                  className="text-base font-medium text-color-brand-highlight"
                  href={CHAMPION_WAITLIST_PAGE}
                >
                  I don’t have a code{' '}
                </Link>
              </div>
              <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
                {isDisabled ? 'Finding your group...' : 'Sign up'}
              </button>
              <div className="mt-8 flex items-center justify-center text-center lg:mt-20">
                <div className="mr-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Already have an account?
                </div>
                {isDisabled ? (
                  <span className="text-sm font-medium leading-4 text-color-brand-highlight opacity-50">
                    Log in
                  </span>
                ) : (
                  <Link
                    className="text-sm font-medium leading-4 text-color-brand-highlight"
                    href={LOGIN_PAGE}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </form>
      </AuthPage>
    </>
  );
}
