import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
// import Link from 'components/Link'; // NOTE: NEED THIS TO TOGGLE TO SIGN UP AND FORGOT PASSWORD
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import {
  COACH_ONBOARDING_STEPS,
  LOGIN_PAGE,
  ONBOARDING_COMPLETE_PAGE,
  PLAYER_ONBOARDING_STEPS,
} from 'constants/pages';
import { RequestStatus } from 'constants/requests';
import {
  CommunicationPreferenceStatusesEnum,
  useInsertAcceptTermsOfServiceMutation,
  useUpdateMarketingCommunicationPreferencesMutation,
} from 'types/generated/client';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useGetIpAddress } from 'hooks/useGetIpAddress';
import { useViewer } from 'hooks/useViewer';
import OnboardingPage from 'layouts/OnboardingPage';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';

const TITLE_TEXT = 'Your data protection';
const DESCRIPTION_TEXT =
  'The General Data Protection Regulation (GDPR) puts you in charge of your personal data. Please select how your data can be used';

const OnboardLegal: React.FC<{ isCoach: boolean }> = ({ isCoach }) => {
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const { ipResponse } = useGetIpAddress();
  const [onboardMutation, { loading: updateLoading }] =
    useUpdateMarketingCommunicationPreferencesMutation();
  const [insertAcceptTermsOfServiceMutation, { loading: insertTosLoading }] =
    useInsertAcceptTermsOfServiceMutation();
  const [isPrivacyChecked, setIsPrivacyChecked] = React.useState(true);
  const [isMarketingChecked, setIsMarketingChecked] = React.useState(true);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url || ONBOARDING_COMPLETE_PAGE;

  React.useEffect(() => {
    const isIdle =
      viewer.status !== AuthStatus.Loading &&
      requestStatus !== RequestStatus.InProgress &&
      requestStatus !== RequestStatus.Success;
    const hasViewer = viewer.status === AuthStatus.User && viewer.viewer;

    if (!hasViewer && isIdle) {
      const next = router.query.next as string;
      const redirectUrl = next ? decodeURIComponent(next) : LOGIN_PAGE;
      router.push(redirectUrl);
    }
  }, [viewer, requestStatus]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (e) => {
      e.preventDefault();

      if (
        updateLoading ||
        requestStatus === RequestStatus.InProgress ||
        requestStatus === RequestStatus.Success
      ) {
        return;
      }

      setRequestStatus(RequestStatus.InProgress);

      let userAgent = '';
      try {
        userAgent = window.navigator.userAgent;
      } catch (error) {}

      try {
        await Promise.all([
          onboardMutation({
            variables: {
              id: viewer.userId || user?.id,
              marketingPreference: isMarketingChecked
                ? CommunicationPreferenceStatusesEnum.Active
                : CommunicationPreferenceStatusesEnum.Inactive,
            },
          }),
          insertAcceptTermsOfServiceMutation({
            variables: {
              userId: viewer.userId || user?.id,
              ip: ipResponse?.ip || '',
              userAgent: userAgent,
            },
          }),
        ]);
        router.push(nextPageUrl);
      } catch (error) {
        Sentry.captureException(error);
        setRequestStatus(RequestStatus.Error);
        toast.error('There was an error. Please try again or reach out to team@bounce.game');
      }
    },
    [
      requestStatus,
      router,
      nextPageUrl,
      isPrivacyChecked,
      isMarketingChecked,
      user,
      viewer,
      updateLoading,
      ipResponse,
    ],
  );

  return (
    <>
      <Head noIndex title="Onboarding Terms" description="Terms of service, privacy, and legal" />
      <OnboardingPage
        onboardSteps={
          <OnboardStepTrackerPanel currentStep={onboardingStepIndex} steps={stepUrls} />
        }
      >
        <form
          className="safearea-pad-y h-safe-screen flex grow flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto pb-4">
            <div className="flex w-full max-w-xl shrink-0 px-6 pt-8 lg:hidden lg:max-w-onboard-content-container">
              <OnboardStepTracker currentStep={onboardingStepIndex} totalSteps={stepUrls.length} />
            </div>
            <div className="flex w-full flex-auto flex-col items-center justify-center px-6">
              <img src="/images/ball/ball-shield.svg" className="w-36" alt="logo" />
              <h1 className="mt-4 flex max-w-xl shrink-0 items-center justify-center lg:max-w-onboard-content-container">
                <span className="text-center text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {TITLE_TEXT}
                </span>
              </h1>
              <div className="mt-2 max-w-xl text-center text-base font-normal leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:max-w-onboard-content-container lg:text-sm">
                {DESCRIPTION_TEXT}
              </div>
              <div className="mt-6 flex w-full max-w-xl flex-col space-y-8 lg:mt-8 lg:max-w-onboard-content-container">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="privacy-policy"
                      name="privacy-policy"
                      type="checkbox"
                      className="checkbox-base"
                      checked={isPrivacyChecked}
                      disabled={isDisabled}
                      onChange={() => setIsPrivacyChecked(!isPrivacyChecked)}
                      required
                    />
                  </div>
                  <div className="ml-4 text-sm">
                    <label htmlFor="privacy-policy" className="leading-6">
                      Acceptance of Terms of Service and confirmation of having read the Privacy
                      Policy
                    </label>
                    <div className="mt-1 flex items-center justify-between text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      <div>(Required)</div>
                      <div>
                        <a
                          href="#"
                          target="_blank"
                          className="text-color-text-lightmode-secondary underline dark:text-color-text-darkmode-secondary"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="promotions"
                      name="promotions"
                      type="checkbox"
                      className="checkbox-base"
                      checked={isMarketingChecked}
                      disabled={isDisabled}
                      onChange={() => setIsMarketingChecked(!isMarketingChecked)}
                    />
                  </div>
                  <div className="ml-4 w-full text-sm">
                    <label htmlFor="promotions" className="leading-6">
                      Consent to receiving Bounce offers
                    </label>
                    <div className="mt-1 flex w-full items-center justify-between text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      <div>(Optional)</div>
                      <div>
                        <a
                          href="#"
                          target="_blank"
                          className="text-color-text-lightmode-secondary underline dark:text-color-text-darkmode-secondary"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 px-6 pb-4">
            <OnboardNextButton buttonText="Continue" isDisabled={isDisabled} />
          </div>
        </form>
      </OnboardingPage>
    </>
  );
};

export default OnboardLegal;
