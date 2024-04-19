import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { COACH_ONBOARDING_STEPS, LOGIN_PAGE, PLAYER_ONBOARDING_STEPS } from 'constants/pages';
import { RequestStatus } from 'constants/requests';
import { SKILL_NO_RESPONSE_RANK } from 'constants/user';
import {
  SportsEnum,
  useGetSkillLevelsQuery,
  useUpdateUserDefaultSportMutation,
  useUpdateUserPickleballSkillLevelMutation,
  useUpdateUserTennisSkillLevelMutation,
} from 'types/generated/client';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Pencil from 'svg/Pencil';
import OnboardingPage from 'layouts/OnboardingPage';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import ModalSelectSkillLevel from './ModalSelectSkillLevel';
import { Props } from './props';

const OnboardSkillLevel: React.FC<Props> = ({ isCoach }) => {
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const { data: skillLevelsData, loading: isGetSkillLevelsLoading } = useGetSkillLevelsQuery();
  const [updateUserTennisSkillLevelMutation, { loading: tennisLoading }] =
    useUpdateUserTennisSkillLevelMutation();
  const [updateUserPickleballSkillLevelMutation, { loading: pickleballLoading }] =
    useUpdateUserPickleballSkillLevelMutation();
  const [updateUserDefaultSportMutation, { loading: defaultSportLoading }] =
    useUpdateUserDefaultSportMutation();
  const [isTennisChecked, setIsTennisChecked] = React.useState(false);
  const [tennisSkillLevel, setTennisSkillLevel] = React.useState('');
  const [isTennisSkillModalOpen, setIsTennisSkillModalOpen] = React.useState(false);
  const [isPickleballChecked, setIsPickleballChecked] = React.useState(false);
  const [isPickleballSkillModalOpen, setIsPickleballSkillModalOpen] = React.useState(false);
  const [pickleballSkillLevel, setPickleballSkillLevel] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const selectedTennisSkillLevel = skillLevelsData?.skillLevels.find(
    (s) => s.id === tennisSkillLevel,
  );
  const selectedPickleballSkillLevel = skillLevelsData?.skillLevels.find(
    (s) => s.id === pickleballSkillLevel,
  );
  const isDisabled =
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    tennisLoading ||
    pickleballLoading ||
    isGetSkillLevelsLoading;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url;

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

      if (tennisLoading || pickleballLoading) {
        return;
      }

      setRequestStatus(RequestStatus.InProgress);

      try {
        const noResponseId =
          skillLevelsData?.skillLevels.find((s) => s.rank === SKILL_NO_RESPONSE_RANK)?.id || null;
        const finalTennisSkillLevel = isTennisChecked ? tennisSkillLevel || noResponseId : null;
        const finalPickleballSkillLevel = isPickleballChecked
          ? pickleballSkillLevel || noResponseId
          : null;

        let defaultSport = null;
        if (isTennisChecked && isPickleballChecked) {
          const tennisRank =
            skillLevelsData?.skillLevels.find((s) => s.id === tennisSkillLevel)?.rank || -1;
          const pickleballRank =
            skillLevelsData?.skillLevels.find((s) => s.id === pickleballSkillLevel)?.rank || -1;

          // NOTE: We're favoring tennis at the moment since at the launch of the platform, our audience is tennis players. If we ever decide to change this, we can just switch the order of the ternary operators below.
          defaultSport = pickleballRank > tennisRank ? SportsEnum.Pickleball : SportsEnum.Tennis;
        } else if (isTennisChecked) {
          defaultSport = SportsEnum.Tennis;
        } else if (isPickleballChecked) {
          defaultSport = SportsEnum.Pickleball;
        }

        const tennisPromise = isTennisChecked
          ? updateUserTennisSkillLevelMutation({
              variables: {
                id: viewer.userId || user?.id,
                tennisSkillLevelId: finalTennisSkillLevel,
              },
            })
          : Promise.resolve();
        const pickleballPromise = isPickleballChecked
          ? updateUserPickleballSkillLevelMutation({
              variables: {
                id: viewer.userId || user?.id,
                pickleballSkillLevelId: finalPickleballSkillLevel,
              },
            })
          : Promise.resolve();
        const defaultSportPromise = defaultSport
          ? updateUserDefaultSportMutation({
              variables: { id: viewer.userId || user?.id, defaultSport },
            })
          : Promise.resolve();

        await Promise.all([tennisPromise, pickleballPromise, defaultSportPromise]);

        router.push(nextPageUrl);
      } catch (error) {
        Sentry.captureException(error);
        setRequestStatus(RequestStatus.Error);
        toast.error('There was an error. Please try again or reach out to team@bounce.game');
      }
    },
    [
      viewer,
      user,
      requestStatus,
      nextPageUrl,
      router,
      tennisLoading,
      pickleballLoading,
      isTennisChecked,
      isPickleballChecked,
      tennisSkillLevel,
      pickleballSkillLevel,
      skillLevelsData,
    ],
  );

  return (
    <>
      <Head noIndex title="Skill Level - Onboarding" description="Your skill level" />
      <OnboardingPage
        onboardSteps={
          <OnboardStepTrackerPanel currentStep={onboardingStepIndex} steps={stepUrls} />
        }
      >
        <form className="safearea-pad-y h-safe-screen flex grow flex-col" onSubmit={handleSubmit}>
          <div className="flex h-full grow flex-col items-center overflow-y-auto pb-4">
            <div className="w-full max-w-xl shrink-0 px-6 pt-8 lg:hidden lg:max-w-onboard-content-container">
              <OnboardStepTracker currentStep={onboardingStepIndex} totalSteps={stepUrls.length} />
            </div>
            <div className="flex w-full flex-auto flex-col items-center px-6 pb-4 pt-8">
              <img src="/images/ball/ball-skill.svg" className="h-24" alt="logo" />
              <h1 className="mt-6 flex shrink-0 items-center justify-center lg:mt-6">
                <span className="text-center text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  What sports do you play?
                </span>
              </h1>
              <div className="mt-2 text-center text-base font-normal leading-6 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                Select your sports. Setting a skill level is optional, and you can always change it
                later.
              </div>
              <div className="mt-6 flex w-full max-w-xl flex-col space-y-2 lg:mt-4 lg:max-w-onboard-content-container">
                <button
                  className={classNames(
                    'relative flex items-center rounded-md border px-4 py-2.5 shadow-checkbox', // @ts-ignore
                    isPickleballChecked
                      ? 'border-color-brand-highlight'
                      : 'dark:border-color-border-input-darkmodey border-color-border-input-lightmode',
                  )}
                  type="button"
                  onClick={() => {
                    if (!isPickleballChecked) {
                      setIsPickleballSkillModalOpen(true);
                    }
                    setIsPickleballChecked(!isPickleballChecked);
                  }}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      className="checkbox-form"
                      checked={isPickleballChecked}
                    />
                  </div>
                  <div className="ml-2 leading-6">
                    <label className="leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Pickleball
                    </label>
                  </div>
                </button>
                {isPickleballChecked && (
                  <button
                    type="button"
                    onClick={() => setIsPickleballSkillModalOpen(true)}
                    className="input-base-form flex w-full items-center justify-between py-2.5 pl-3.5 pr-4 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                  >
                    <div className="text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                      {selectedPickleballSkillLevel?.displayName ||
                        'Add your skill level (optional)'}
                    </div>
                    <div>
                      <Pencil className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                    </div>
                  </button>
                )}
              </div>
              <div className="mt-6 flex w-full max-w-xl flex-col space-y-2 lg:mt-4 lg:max-w-onboard-content-container">
                <button
                  className={classNames(
                    'relative flex items-center rounded-md border px-4 py-2.5 shadow-checkbox', // @ts-ignore
                    isTennisChecked
                      ? 'border-color-brand-highlight'
                      : 'dark:border-color-border-input-darkmodey border-color-border-input-lightmode',
                  )}
                  type="button"
                  onClick={() => {
                    if (!isTennisChecked) {
                      setIsTennisSkillModalOpen(true);
                    }
                    setIsTennisChecked(!isTennisChecked);
                  }}
                >
                  <div className="flex h-5 items-center">
                    <input type="checkbox" className="checkbox-form" checked={isTennisChecked} />
                  </div>
                  <div className="ml-2 leading-6">
                    <label className="leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Tennis
                    </label>
                  </div>
                </button>
                {isTennisChecked && (
                  <button
                    type="button"
                    onClick={() => setIsTennisSkillModalOpen(true)}
                    className="input-base-form flex w-full items-center justify-between py-2.5 pl-3.5 pr-4 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                  >
                    <div className="text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                      {selectedTennisSkillLevel?.displayName || 'Add your skill level (optional)'}
                    </div>
                    <div>
                      <Pencil className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0 px-6 pb-4">
            <OnboardNextButton
              isDisabled={isDisabled}
              bottomMessage="You can add or update your skill level in your profile"
            />
          </div>
        </form>
      </OnboardingPage>
      <ModalSelectSkillLevel
        isOpen={isTennisSkillModalOpen}
        handleClose={() => setIsTennisSkillModalOpen(false)}
        skillLevels={skillLevelsData?.skillLevels || []}
        setSkillLevel={(skillLevel) => setTennisSkillLevel(skillLevel)}
        sportName="Tennis"
      />
      <ModalSelectSkillLevel
        isOpen={isPickleballSkillModalOpen}
        handleClose={() => setIsPickleballSkillModalOpen(false)}
        skillLevels={skillLevelsData?.skillLevels || []}
        setSkillLevel={(skillLevel) => setPickleballSkillLevel(skillLevel)}
        sportName="Pickleball"
      />
    </>
  );
};

export default OnboardSkillLevel;
