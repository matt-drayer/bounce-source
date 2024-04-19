import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import * as Sentry from '@sentry/nextjs';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE, LOGIN_PAGE } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { auth } from 'services/client/firebase';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { useViewer } from 'hooks/useViewer';
import LogoWithName from 'svg/LogoWithName';
import AuthPage from 'layouts/AuthPage';
import AuthSideContent from 'layouts/AuthPage/AuthSideContent';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled = requestStatus === RequestStatus.InProgress;
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

  React.useEffect(() => {
    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(decodeURIComponent(router.query.email));
    }
  }, [router.isReady]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();

      if (requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success) {
        return;
      }

      setRequestStatus(RequestStatus.InProgress);
      setError(null);

      sendPasswordResetEmail(auth, email)
        .then(function () {
          setRequestStatus(RequestStatus.Success);
          setIsSuccessOpen(true);
          return;
        })
        .catch(function (errorResponse) {
          Sentry.captureException(error);
          setRequestStatus(RequestStatus.Error);
          setError(errorResponse);
        });
    },
    [email, requestStatus, setIsSuccessOpen],
  );

  return (
    <>
      <Head title="Forgot password" description="Recover your Bounce password" />
      <AuthPage
        sideContent={
          <AuthSideContent
            imageSrc="/images/app/players-one.svg"
            title="Get back in the game"
            description="Out of bounds? No problem. We'll send you a link to reset your password."
          />
        }
      >
        <form
          className="h-safe-screen flex grow flex-col items-center lg:justify-center"
          onSubmit={handleSubmit}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto lg:h-auto lg:max-w-[408px] lg:grow-0">
            <h1 className="flex shrink-0 items-center justify-center space-x-4 px-6 pt-12">
              <span className="text-2xl font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                <LogoWithName className="h-7" />
              </span>
            </h1>
            <div
              className={classNames(
                'flex h-full w-full grow flex-col items-center justify-center overflow-y-auto px-6 transition-opacity duration-700',
                isHidden ? 'opacity-0' : 'opacity-100',
              )}
            >
              <h2 className="font mb-6 text-xl lg:mt-10">Reset your password</h2>
              <div className="flex w-full flex-col space-y-8">
                <div className="w-full">
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isDisabled}
                    className="input-form"
                    required
                  />
                </div>
              </div>
              <div className="mt-16 text-center lg:mt-20">
                <div className="mb-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Remember your password?
                </div>
                {isDisabled ? (
                  <span className="text-sm leading-4 text-color-brand-highlight underline opacity-50">
                    Return to log in page
                  </span>
                ) : (
                  <Link
                    href={`${LOGIN_PAGE}${!!email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-sm leading-4 text-color-brand-highlight underline"
                  >
                    Return to log in page
                  </Link>
                )}
              </div>
            </div>
            <div
              className={classNames(
                'w-full shrink-0 px-6 pb-14 transition-opacity duration-700 lg:mt-16 lg:max-w-[408px]',
                isHidden ? 'opacity-0' : 'opacity-100',
              )}
            >
              <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
                {isDisabled ? 'Sending reset email...' : 'Reset password'}
              </button>
            </div>
          </div>
        </form>
      </AuthPage>
      <Transition.Root show={isSuccessOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsSuccessOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-color-bg-lightmode-primary px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-color-bg-darkmode-primary sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-100">
                        Password reset email sent
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Check your inbox for {email} and follow the link to reset your password.
                          Return to the{' '}
                          <Link
                            href={`${LOGIN_PAGE}${
                              !!email ? `?email=${encodeURIComponent(email)}` : ''
                            }`}
                            className="underline"
                          >
                            log in page
                          </Link>{' '}
                          to sign into your account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="button-rounded-full-primary"
                      onClick={() => setIsSuccessOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ForgotPassword;
