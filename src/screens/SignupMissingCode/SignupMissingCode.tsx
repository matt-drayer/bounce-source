import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  CHAMPION_WAITLIST_SUCCESS_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  SIGNUP_CODE_PAGE,
} from 'constants/pages';
import { PostRequestPayload } from 'constants/payloads/championWaitlist';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { auth } from 'services/client/firebase';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { useApiGateway } from 'hooks/useApi';
import { useViewer } from 'hooks/useViewer';
import LogoWithName from 'svg/LogoWithName';
import AuthPage from 'layouts/AuthPage';
import AuthSideContent from 'layouts/AuthPage/AuthSideContent';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import MailIcon from './MailIcon';

export default function SignupMissingCode() {
  const router = useRouter();
  const viewer = useViewer();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled = requestStatus === RequestStatus.InProgress;
  const { post } = useApiGateway<PostRequestPayload>('/v1/champion/waitlist');
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
      <Head noIndex title="Champion waitlist" description="Request to become a champaion" />
      <AuthPage
        sideContent={
          <AuthSideContent
            imageSrc="/images/app/players-one.svg"
            title="Get in the game"
            description="Hit different."
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

            await post({
              payload: {
                name,
                email,
              },
            });

            router.push(CHAMPION_WAITLIST_SUCCESS_PAGE);

            setRequestStatus(RequestStatus.Success);
          }}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto lg:h-auto lg:max-w-[408px] lg:grow-0">
            <div
              className={classNames(
                'flex h-full w-full grow flex-col items-center justify-center overflow-y-auto px-6 py-2 transition-opacity duration-700',
                isHidden ? 'opacity-0' : 'opacity-100',
              )}
            >
              <h1 className="flex shrink-0 items-center justify-center space-x-4 px-6 pt-16">
                <span className="text-2xl font-semibold">
                  <MailIcon />
                </span>
              </h1>
              <h2 className="mb-5 mt-3 text-2xl lg:mt-10">No code? No problem.</h2>
              <p className="mb-6 px-6 text-center text-base text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Get in touch and we'll plug you into a local community or help you create your own
                group.
              </p>
              <div className="flex w-full flex-col space-y-8">
                <div className="w-full py-2">
                  <label className="sr-only" htmlFor="name">
                    First and last name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    value={name}
                    onFocus={() => setError(null)}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={isDisabled}
                    className="input-form"
                    required
                  />
                </div>
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
                    placeholder="Your email"
                    disabled={isDisabled}
                    className="input-form"
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
              <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
                {isDisabled ? 'Submitting request...' : 'Send'}
              </button>
              <div className="mt-8 flex items-center justify-center text-center lg:mt-20">
                {isDisabled ? (
                  <span className="text-sm font-medium leading-4 text-color-brand-highlight opacity-50">
                    Go back
                  </span>
                ) : (
                  <Link
                    className="text-sm font-medium leading-4 text-color-brand-highlight"
                    href={SIGNUP_CODE_PAGE}
                  >
                    Go back
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
