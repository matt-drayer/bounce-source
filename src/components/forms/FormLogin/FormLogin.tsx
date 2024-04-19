import * as React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { FORGOT_PASSWORD_PAGE, HOME_PAGE, SIGNUP_CODE_PAGE } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { auth } from 'services/client/firebase';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { sleep } from 'utils/shared/sleep';
import { useViewer } from 'hooks/useViewer';
import LogoWithName from 'svg/LogoWithName';
import Link from 'components/Link';
import CardError from 'components/cards/CardError';
import classNames from 'styles/utils/classNames';

interface Props {
  isShowSignupLink?: boolean;
  loginSuccessUrl?: string;
  setIsCloseBlocked?: (isCloseBlocked: boolean) => void;
  toggleSignup?: () => void;
  isFormOnly?: boolean;
  formWrapperClassName?: string;
  buttonWrapperClassName?: string;
  spacerClassName?: string;
  shouldSkipReload?: boolean;
  handleAuthComplete?: () => void;
}

export default function FormLogin({
  loginSuccessUrl,
  setIsCloseBlocked = () => {},
  isShowSignupLink = false,
  toggleSignup,
  isFormOnly,
  formWrapperClassName,
  buttonWrapperClassName,
  spacerClassName,
  shouldSkipReload,
  handleAuthComplete,
}: Props) {
  const router = useRouter();
  const viewer = useViewer();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    viewer.status === AuthStatus.User;
  const isHidden =
    !getIsNativePlatform() &&
    (viewer.status === AuthStatus.Loading || viewer.status === AuthStatus.User) &&
    !error &&
    requestStatus !== RequestStatus.InProgress &&
    requestStatus !== RequestStatus.Success;

  React.useEffect(() => {
    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(decodeURIComponent(router.query.email));
    }
  }, [router.isReady]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (e) => {
      e.preventDefault();

      if (requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success) {
        return;
      }

      setIsCloseBlocked(true);
      setRequestStatus(RequestStatus.InProgress);
      setError(null);

      signInWithEmailAndPassword(auth, email, password)
        .then(function (user) {
          setRequestStatus(RequestStatus.Success);
          return user;
        })
        .then(async () => {
          const loggedInUser = auth.currentUser;
          await loggedInUser?.getIdToken(true);
          // NOTE: Giving time for the current user query to run since it's triggered in the useEffect in src/context/CurrentUserContext.
          await sleep(1000);
          setIsCloseBlocked(false);

          if (loginSuccessUrl) {
            const next = router.query.next as string;
            const redirectUrl = next ? decodeURIComponent(next) : loginSuccessUrl;
            router.push(redirectUrl);
          } else if (!shouldSkipReload) {
            router.reload();
          } else if (handleAuthComplete) {
            handleAuthComplete();
          }
        })
        .catch(function (errorResponse) {
          Sentry.captureException(error);
          setRequestStatus(RequestStatus.Error);
          setIsCloseBlocked(false);
          setError(errorResponse.code ? new Error(errorResponse.code) : errorResponse);
        });
    },
    [email, password, requestStatus],
  );

  return (
    <>
      <form
        className="flex h-full w-full grow flex-col items-center lg:justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex h-full w-full grow flex-col items-center overflow-y-auto lg:h-auto lg:max-w-[560px] lg:grow-0">
          {!isFormOnly && (
            <h1 className="flex shrink-0 items-center justify-center space-x-4 px-6 pt-12">
              <span className="text-2xl font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                <LogoWithName className="h-6" />
              </span>
            </h1>
          )}
          <div
            className={classNames(
              'flex w-full flex-auto flex-col items-center justify-center transition-opacity duration-700',
              !isFormOnly && 'px-6 py-4',
              !!formWrapperClassName && formWrapperClassName,
              isHidden ? 'opacity-0' : 'opacity-100',
            )}
          >
            {!isFormOnly && <h2 className="font mb-6 text-xl lg:mt-10">Welcome back!</h2>}
            <div
              className={classNames(
                'flex w-full flex-col',
                spacerClassName ? spacerClassName : 'space-y-8',
              )}
            >
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
                  placeholder="Email"
                  disabled={isDisabled}
                  className="input-form"
                  required
                />
              </div>
              <div className="w-full">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    autoComplete="password"
                    name="current-password"
                    type={isShowPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isDisabled}
                    className="input-form ph-no-autocapture"
                    required
                  />
                  <div className="absolute right-4 top-3 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    {isShowPassword ? (
                      <button
                        className="h-4 w-4"
                        type="button"
                        onClick={() => setIsShowPassword(false)}
                      >
                        <EyeIcon />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setIsShowPassword(true)}>
                        <EyeSlashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-6 text-right">
                  {isDisabled ? (
                    <span className="font-medium text-color-brand-highlight opacity-50">
                      Forgot password?
                    </span>
                  ) : (
                    <Link
                      href={`${FORGOT_PASSWORD_PAGE}${
                        !!email ? `?email=${encodeURIComponent(email)}` : ''
                      }`}
                      className="font-medium text-color-brand-highlight"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {isShowSignupLink && (
              <div className="mt-16 text-center lg:mt-20">
                <div className="mb-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Don't have an account yet?
                </div>
                {isDisabled ? (
                  <span className="text-sm font-medium leading-4 text-color-brand-highlight opacity-50">
                    Create an account
                  </span>
                ) : toggleSignup ? (
                  <button
                    className="text-sm font-medium leading-4 text-color-brand-highlight"
                    type="button"
                    onClick={() => toggleSignup()}
                  >
                    Create an account
                  </button>
                ) : (
                  <Link
                    href={SIGNUP_CODE_PAGE}
                    className="text-sm font-medium leading-4 text-color-brand-highlight"
                  >
                    Create an account
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className={classNames(
            'w-full shrink-0 transition-opacity duration-700 lg:max-w-[560px]',
            !isFormOnly && 'px-4 pb-16 sm:px-[6.25rem]',
            !!buttonWrapperClassName && buttonWrapperClassName,
            isHidden ? 'opacity-0' : 'opacity-100',
          )}
        >
          {!!error?.message && (
            <div className="mb-4">
              <CardError>{error.message}</CardError>
            </div>
          )}
          <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
            {isDisabled ? 'Logging in...' : 'Log in'}
          </button>
        </div>
      </form>
    </>
  );
}
