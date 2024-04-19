import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  COACH_ONBOARDING_STEPS,
  LOGIN_PAGE,
  ONBOARDING_COMPLETE_PAGE,
  PLAYER_ONBOARDING_STEPS,
} from 'constants/pages';
import { HOME_PAGE } from 'constants/pages';
import { RequestStatus } from 'constants/requests';
import {
  FollowStatusesEnum,
  useGetActiveCoachProfilesLazyQuery,
  useGetUserFollowingIdsLazyQuery,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import OnboardingPage from 'layouts/OnboardingPage';
import Link from 'components/Link';
import CardFollowCoach from 'components/cards/CardFollowCoach';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';
import { StyledScroll } from './styles';

const TITLE_TEXT = "Let's get started!";
const DESCRIPTION_TEXT = 'Follow your coach to get access to their lessons and schedule.';

const OnboardFollowCoach: React.FC<{ isCoach: boolean }> = ({ isCoach }) => {
  const router = useRouter();
  const viewer = useViewer();
  const [getActiveCoachProfilesLazyQuery, { data }] = useGetActiveCoachProfilesLazyQuery();
  const [getUserFollowingIdsLazyQuery, { data: followData, loading, called }] =
    useGetUserFollowingIdsLazyQuery();
  const [searchText, setSearchText] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url || ONBOARDING_COMPLETE_PAGE;
  const followedCoachesList = followData?.userFollows || [];
  const followedCoaches = followedCoachesList.reduce((acc, curr) => {
    acc[curr.followedUserId] = curr.status;
    return acc;
  }, {} as { [key: string]: FollowStatusesEnum });
  const coaches = (data?.userProfiles || []).filter((coach) => {
    if (!searchText) {
      return coach;
    }

    return (
      coach?.fullName?.toUpperCase().includes(searchText.toUpperCase()) ||
      coach?.username?.toUpperCase().includes(searchText.toUpperCase())
    );
  });

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

  React.useEffect(() => {
    const queryFetch = async () => {
      if (viewer.userId) {
        try {
          await Promise.all([
            getActiveCoachProfilesLazyQuery(),
            getUserFollowingIdsLazyQuery({
              variables: {
                followerUserId: viewer.userId,
              },
            }),
          ]);
        } catch (error) {
          Sentry.captureException(error);
        }
      }
    };

    queryFetch();
  }, [viewer.userId]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();

      // NOTE: These will be graphql so probably won't be tracking addition state
      if (requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success) {
        return;
      }

      setRequestStatus(RequestStatus.InProgress);
      router.push(nextPageUrl);

      // TODO: PUSH OR LINK TO NEXT PAGE?
    },
    [requestStatus, router, nextPageUrl],
  );

  return (
    <>
      <Head
        noIndex
        title="Onboarding Follow"
        description="Follow coaches on Bounce to see their lessons"
      />
      <OnboardingPage
        onboardSteps={
          <OnboardStepTrackerPanel currentStep={onboardingStepIndex} steps={stepUrls} />
        }
      >
        <form
          className="safearea-pad-y h-safe-screen flex grow flex-col items-center overflow-hidden px-6"
          onSubmit={handleSubmit}
        >
          <div className="h-safe-screen flex w-full grow flex-col items-center lg:max-w-onboard-content-container">
            <div className="mb-8 flex w-full shrink-0 pt-8 lg:hidden">
              <OnboardStepTracker currentStep={onboardingStepIndex} totalSteps={stepUrls.length} />
            </div>
            <div className="flex shrink-0 flex-col items-center lg:pt-12">
              <img src="/images/ball/ball-players.svg" className="w-28" alt="logo" />
              <h1 className="mt-4 flex shrink-0 items-center justify-center">
                <span className="text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {TITLE_TEXT}
                </span>
              </h1>
              <div className="mt-2 text-center text-base font-normal leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {DESCRIPTION_TEXT}
              </div>
            </div>
            <div className="relative z-10 mt-6 flex w-full flex-col ">
              <div className="w-full">
                <label className="sr-only" htmlFor="search-coach">
                  Search for coach
                </label>
                <input
                  id="search-coach"
                  name="search-coach"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  type="text"
                  placeholder="Search coaches"
                  disabled={isDisabled}
                  className="input-form"
                />
              </div>
            </div>
            <div className="follow-scrollbar flex w-full grow flex-col space-y-2 overflow-y-auto rounded-md pb-8 pt-4 lg:mt-4 lg:bg-brand-gray-25 lg:p-4">
              {coaches.map((coach) => {
                return (
                  <CardFollowCoach
                    key={coach.id}
                    coach={coach}
                    isLoading={loading || !called}
                    userId={viewer.userId}
                    isFollowing={followedCoaches[coach.id] === FollowStatusesEnum.Active}
                  />
                );
              })}
            </div>
            <div className="flex w-full shrink-0 flex-col pb-6 pt-5">
              <OnboardNextButton
                buttonText="Continue"
                isDisabled={isDisabled}
                bottomMessage={<Link href={HOME_PAGE}>Skip</Link>}
              />
            </div>
          </div>
        </form>
      </OnboardingPage>
    </>
  );
};

export default OnboardFollowCoach;
