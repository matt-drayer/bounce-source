import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
// import Link from 'components/Link'; // NOTE: NEED THIS TO TOGGLE TO SIGN UP AND FORGOT PASSWORD
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AuthStatus } from 'constants/auth';
import { COACH_ONBOARDING_STEPS, LOGIN_PAGE, PLAYER_ONBOARDING_STEPS } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import {
  CoachQualificationStatusesEnum,
  useSetUserCoachQualificationsMutation,
} from 'types/generated/client';
import { CoachQualificationGroupsEnum } from 'types/generated/server';
import { useViewer } from 'hooks/useViewer';
import OnboardingPage from 'layouts/OnboardingPage';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import { Props } from './props';

const TITLE_PHRASE_COACH = 'What are your qualifications?';
const TITLE_PHRASE_PLAYER = 'What are your qualifications?';

const OnboardQualifications: React.FC<Props> = ({ isCoach, coachQualifications }) => {
  const router = useRouter();
  const viewer = useViewer();
  const [isFormerCollegeOpen, setIsFormerCollegeOpen] = React.useState(false);
  const [isCurrentCollegeOpen, setIsCurrentCollegeOpen] = React.useState(false);
  const [setUserCoachQualificationsMutation, { loading }] = useSetUserCoachQualificationsMutation();
  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      coachExperienceYears: 0,
    },
  });
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url;
  const values = watch();

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

  const certificateQualifications = coachQualifications.filter(
    (qualification) => qualification.groupId === CoachQualificationGroupsEnum.Certificate,
  );
  const formerCollegeQualifications = coachQualifications.filter(
    (qualification) => qualification.groupId === CoachQualificationGroupsEnum.FormerCollegePlayer,
  );
  const currentCollegeQualifications = coachQualifications.filter(
    (qualification) => qualification.groupId === CoachQualificationGroupsEnum.CurrentCollegePlayer,
  );
  const rest = coachQualifications.filter((qualification) => !qualification.groupId);

  return (
    <>
      <Head noIndex title="Onboarding Qualifications" description="Coach qualifications" />
      <OnboardingPage
        onboardSteps={
          <OnboardStepTrackerPanel currentStep={onboardingStepIndex} steps={stepUrls} />
        }
      >
        <form
          className="safearea-pad-y h-safe-screen flex grow flex-col items-center"
          onSubmit={handleSubmit(async (data) => {
            if (
              requestStatus === RequestStatus.InProgress ||
              requestStatus === RequestStatus.Success ||
              loading
            ) {
              return;
            }

            setRequestStatus(RequestStatus.InProgress);

            try {
              const qualificationObjects = coachQualifications.map((qualification) => {
                return {
                  userId: viewer.userId,
                  coachQualificationId: qualification.id,
                  // @ts-ignore need to account for ids in form data types
                  status: data[qualification.id]
                    ? CoachQualificationStatusesEnum.Active
                    : CoachQualificationStatusesEnum.Inactive,
                };
              });
              const variables = {
                userId: viewer.userId,
                coachExperienceYears: data.coachExperienceYears || 0,
                objects: qualificationObjects,
              };
              await setUserCoachQualificationsMutation({ variables });
              router.push(nextPageUrl);
            } catch (error) {
              Sentry.captureException(error);
              setRequestStatus(RequestStatus.Error);
            }
          })}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto pb-4">
            <div className="w-full max-w-xl shrink-0 px-6 pt-8 lg:hidden lg:max-w-onboard-content-container">
              <OnboardStepTracker currentStep={onboardingStepIndex} totalSteps={stepUrls.length} />
            </div>
            <div className="flex w-full flex-auto grow flex-col items-center overflow-y-auto px-6 pb-16 pt-6">
              <div className="flex w-full max-w-xl flex-auto flex-col items-center justify-center lg:max-w-onboard-content-container">
                <img src="/images/ball/ball-qualifications.svg" className="w-20" alt="logo" />
                <h1 className="mt-6 flex shrink-0 items-center justify-center">
                  <span className="text-center text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {isCoach ? TITLE_PHRASE_COACH : TITLE_PHRASE_PLAYER}
                  </span>
                </h1>
                <div className="mt-2 text-center text-base font-normal leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Players will see these on your profile.
                </div>
                <div className="mt-4 w-full">
                  <label htmlFor="lesson-participant-limit" className="label-form">
                    Years of coaching experience
                  </label>
                  <div className="flex items-stretch space-x-3">
                    <button
                      type="button"
                      className="input-form flex w-1/5 items-center justify-center text-lg font-semibold"
                      disabled={isDisabled}
                      onClick={() => {
                        setValue('coachExperienceYears', values['coachExperienceYears'] - 1);
                      }}
                    >
                      -
                    </button>
                    <input
                      {...register('coachExperienceYears', {
                        required: true,
                        min: 0,
                        max: 100,
                        valueAsNumber: true,
                      })}
                      type="number"
                      onWheel={(e) => {
                        // NOTE: Prevent wheel scroll from changing number
                        e.preventDefault();
                        e.currentTarget.blur();
                        return false;
                      }}
                      placeholder="Years"
                      step="1"
                      min="0"
                      max="100"
                      disabled={isDisabled}
                      className={classNames(
                        'input-form w-3/5 text-center focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                      )}
                    />
                    <button
                      type="button"
                      disabled={isDisabled}
                      className="input-form flex w-1/5 items-center justify-center text-lg"
                      onClick={() => {
                        setValue('coachExperienceYears', values['coachExperienceYears'] + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <div className="label-base w-full">Certificate</div>
                  <div className="mt-2 flex w-full flex-col space-y-4">
                    {certificateQualifications.map((qualification) => {
                      return (
                        <button
                          key={qualification.id}
                          type="button"
                          onClick={() => {
                            // @ts-ignore
                            setValue(qualification.id, !values[qualification.id]);
                          }}
                          className={classNames(
                            'relative flex items-center rounded-md border px-4 py-2',
                            // @ts-ignore
                            values[qualification.id]
                              ? 'border-color-brand-highlight'
                              : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                          )}
                        >
                          <div className="flex h-5 items-center">
                            <input
                              id={qualification.id}
                              {...register(qualification.id)}
                              type="checkbox"
                              className="checkbox-form"
                            />
                          </div>
                          <div className="ml-2 leading-6">
                            <label className="leading-6">{qualification.name}</label>
                          </div>
                        </button>
                      );
                    })}
                    <div
                      className={classNames(
                        'relative rounded-md border px-4 py-2', // @ts-ignore
                        isFormerCollegeOpen
                          ? 'border-color-brand-highlight'
                          : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsFormerCollegeOpen(!isFormerCollegeOpen);
                        }}
                        className={classNames('flex items-center')}
                      >
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            className="checkbox-form"
                            checked={isFormerCollegeOpen}
                          />
                        </div>
                        <div className="ml-2 leading-6">
                          <label className="leading-6">Former College Player</label>
                        </div>
                      </button>
                      {isFormerCollegeOpen && (
                        <div className="mb-2 mt-4 space-y-3">
                          {formerCollegeQualifications.map((qualification) => {
                            return (
                              <div
                                key={qualification.id}
                                className={classNames('flex items-center pl-7')}
                              >
                                <div className="flex h-5 items-center">
                                  <input
                                    id={qualification.id}
                                    {...register(qualification.id)}
                                    type="checkbox"
                                    className="checkbox-form"
                                  />
                                </div>
                                <div className="ml-2 leading-6">
                                  <label htmlFor={qualification.id} className="leading-6">
                                    {qualification.name}
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div
                      className={classNames(
                        'relative rounded-md border px-4 py-2', // @ts-ignore
                        isCurrentCollegeOpen
                          ? 'border-color-brand-highlight'
                          : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsCurrentCollegeOpen(!isCurrentCollegeOpen);
                        }}
                        className={classNames('flex items-center')}
                      >
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            className="checkbox-form"
                            checked={isCurrentCollegeOpen}
                          />
                        </div>
                        <div className="ml-2 leading-6">
                          <label className="leading-6">Current College Player</label>
                        </div>
                      </button>
                      {isCurrentCollegeOpen && (
                        <div className="mb-2 mt-4 space-y-3">
                          {currentCollegeQualifications.map((qualification) => {
                            return (
                              <div
                                key={qualification.id}
                                className={classNames('flex items-center pl-7')}
                              >
                                <div className="flex h-5 items-center">
                                  <input
                                    id={qualification.id}
                                    {...register(qualification.id)}
                                    type="checkbox"
                                    className="checkbox-form"
                                  />
                                </div>
                                <div className="ml-2 leading-6">
                                  <label htmlFor={qualification.id} className="leading-6">
                                    {qualification.name}
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {rest.map((qualification) => {
                      return (
                        <button
                          key={qualification.id}
                          type="button"
                          onClick={() => {
                            // @ts-ignore
                            setValue(qualification.id, !values[qualification.id]);
                          }}
                          className={classNames(
                            'relative flex items-center rounded-md border px-4 py-2',
                            // @ts-ignore
                            values[qualification.id]
                              ? 'border-color-brand-highlight'
                              : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                          )}
                        >
                          <div className="flex h-5 items-center">
                            <input
                              {...register(qualification.id)}
                              type="checkbox"
                              className="checkbox-form"
                            />
                          </div>
                          <div className="ml-2 leading-6">
                            <label className="leading-6">{qualification.name}</label>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 px-6 pb-4">
            <OnboardNextButton isDisabled={isDisabled} />
          </div>
        </form>
      </OnboardingPage>
    </>
  );
};

export default OnboardQualifications;
