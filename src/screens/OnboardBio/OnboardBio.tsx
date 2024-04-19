import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { getDaysInMonth } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { MediaProviders } from 'constants/media';
import { COACH_ONBOARDING_STEPS, LOGIN_PAGE, PLAYER_ONBOARDING_STEPS } from 'constants/pages';
import { RequestStatus } from 'constants/requests';
import { MINIMUM_BIRTH_YEAR, MONTH_INDEX_SHORT } from 'constants/time';
import { EMPTY_AVATAR_SRC } from 'constants/user';
import {
  GenderEnum,
  useUpdateUserOnboardBioMutation,
  useUpdateUserProfileImageMutation,
} from 'types/generated/client';
import { getImageUrl } from 'services/client/imagekit/getImageUrl';
import { uploadImage } from 'services/client/imagekit/uploadImage';
import { generateRandomFileName } from 'utils/shared/media/generateRandomFileName';
// import { normalizeRating } from 'utils/shared/tennis/normalizeRating';
import { getNumberRange } from 'utils/shared/time/getNumberRange';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import AddPhoto from 'svg/AddPhoto';
import OnboardingPage from 'layouts/OnboardingPage';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import { Props } from './props';

const BIRTH_YEAR_RANGE = getNumberRange({
  startItem: MINIMUM_BIRTH_YEAR,
  endItem: new Date().getFullYear(),
  isDesc: true,
});
const DEFAULT_DAY_RANGE = getNumberRange({
  startItem: 1,
  endItem: 31,
  isDesc: false,
});

const OnboardBio: React.FC<Props> = ({
  isCoach,
  // tennisRatingScales,
  // normalizedRatingScale,
}) => {
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const [onboardMutation, { loading: updateLoading }] = useUpdateUserOnboardBioMutation();
  const [updateUserProfileImageMutation] = useUpdateUserProfileImageMutation();
  const [birthYear, setBirthYear] = React.useState('');
  const [birthMonth, setBirthMonth] = React.useState('');
  const [birthDay, setBirthDay] = React.useState('');
  const [gender, setGender] = React.useState<null | GenderEnum>(null);
  const [preferredGender, setPreferredGender] = React.useState('');
  // const [ratingScale, setRatingScale] = React.useState('');
  // const [rating, setRating] = React.useState('');
  const [profileImagePreview, setProfileImagePreview] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const [imageRequestStatus, setImageRequestStatus] = React.useState(RequestStatus.Idle);
  const isImageUploading = imageRequestStatus === RequestStatus.InProgress;
  const isDisabled =
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    updateLoading;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url;
  // const activeRatingScale = tennisRatingScales?.find((scale) => scale.id === ratingScale);
  const daysOfMonth =
    !!birthYear && !!birthMonth
      ? getNumberRange({
          startItem: 1,
          endItem: getDaysInMonth(new Date(parseInt(birthYear, 10), parseInt(birthMonth, 10))),
          isDesc: false,
        })
      : DEFAULT_DAY_RANGE;

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
    if (user?.birthday) {
      const [year, month, day] = user.birthday.split('-');
      setBirthYear(year);
      setBirthMonth(`${parseInt(month, 10) - 1}`);
      setBirthDay(`${parseInt(day, 10)}`);
    }

    if (user?.gender) {
      setGender(user.gender as GenderEnum);
    }

    if (user?.genderPreference) {
      setPreferredGender(user.genderPreference);
    }

    // if (user?.tennisRatingScaleId) {
    //   setRatingScale(user.tennisRatingScaleId);
    // }

    // if (user?.tennisRating) {
    //   setRating(user.tennisRating);
    // }
  }, [user]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (e) => {
      e.preventDefault();

      if (updateLoading) {
        return;
      }

      if (!birthYear || !birthMonth || !birthDay || !gender) {
        return;
      }

      // if (!!tennisRatingScales && !ratingScale) {
      //   return;
      // }

      // const selectedRatingScale = tennisRatingScales?.find((scale) => scale.id === ratingScale);
      // const normalizedRating =
      //   selectedRatingScale?.shortName && rating
      //     ? normalizeRating({
      //         ratingScaleShortName: selectedRatingScale?.shortName || '',
      //         rating: parseFloat(rating),
      //         gender: gender,
      //       })
      //     : null;

      setRequestStatus(RequestStatus.InProgress);

      try {
        const formattedMonth = `${parseInt(birthMonth, 10) + 1}`.padStart(2, '0');
        const formattedDate = birthDay.padStart(2, '0');

        await onboardMutation({
          variables: {
            id: viewer.userId || user?.id,
            birthday: `${birthYear}-${formattedMonth}-${formattedDate}`,
            gender: gender,
            genderPreference: preferredGender || '',
            // normalizedTennisRating: normalizedRating,
            // normalizedTennisRatingScaleId: normalizedRatingScale?.id || null,
            // tennisRating: parseFloat(rating) >= 0 ? parseFloat(rating) : null,
            // tennisRatingScaleId: ratingScale || null,
          },
        });
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
      updateLoading,
      birthYear,
      birthMonth,
      birthDay,
      gender,
      preferredGender,
      // rating,
      // ratingScale,
      // tennisRatingScales,
    ],
  );

  return (
    <>
      <Head noIndex title="Onboarding Bio" description="Your Bounce bio" />
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
            <div className="flex w-full flex-auto flex-col items-center justify-center px-6 py-4">
              <div className="relative mb-0.5">
                <img
                  src={profileImagePreview || EMPTY_AVATAR_SRC}
                  className={classNames(
                    'h-28 w-28 rounded-full',
                    isImageUploading && 'opacity-60',
                    !profileImagePreview && 'grayscale',
                  )}
                  alt="avatar"
                />
                <div className="absolute -bottom-2 -right-2 z-10 ">
                  <label
                    htmlFor="profile-image"
                    className={classNames(
                      'cursor-pointer rounded-full bg-color-brand-highlight p-2.5 shadow-fab',
                      isImageUploading ? 'hidden' : 'block',
                    )}
                  >
                    <span className="block h-6 w-6 text-color-text-darkmode-primary">
                      <AddPhoto className="h-6 w-6" />
                    </span>
                  </label>
                  <input
                    id="profile-image"
                    name="profile-image"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    disabled={isDisabled || isImageUploading}
                    onChange={async (e) => {
                      if (imageRequestStatus === RequestStatus.InProgress || !viewer.userId) {
                        return;
                      }

                      const file = e.target?.files?.[0];
                      if (file) {
                        setImageRequestStatus(RequestStatus.InProgress);

                        try {
                          const newPreviewUrl = URL.createObjectURL(file);
                          setProfileImagePreview(newPreviewUrl);
                        } catch (error) {
                          Sentry.captureException(error);
                        }

                        try {
                          const uploadResponse = await uploadImage({
                            file,
                            fileName: generateRandomFileName(file),
                            useUniqueFileName: true,
                            tags: ['profile', viewer?.userId],
                            folder: '',
                          });
                          const updateResponse = await updateUserProfileImageMutation({
                            variables: {
                              id: viewer.userId,
                              profileImageFileName: uploadResponse.name,
                              profileImagePath: uploadResponse.filePath,
                              profileImageProvider: MediaProviders.ImageKit,
                              profileImageProviderId: uploadResponse.fileId,
                              profileImageProviderUrl: uploadResponse.url,
                            },
                          });
                          const finalUrl = !!updateResponse.data?.updateUsersByPk?.profileImagePath
                            ? getImageUrl(updateResponse.data?.updateUsersByPk?.profileImagePath)
                            : '';
                          if (finalUrl) {
                            setProfileImagePreview(finalUrl);
                          }
                          setImageRequestStatus(RequestStatus.Success);
                        } catch (error) {
                          Sentry.captureException(error);
                          setImageRequestStatus(RequestStatus.Error);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <h1 className="mt-4 flex shrink-0 items-center justify-center">
                <span className="text-2xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {user?.fullName || ' '}&nbsp;
                </span>
              </h1>
              <h2 className="mt-8 flex shrink-0 items-center justify-center lg:mt-6">
                <span className="text-center text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Tell us a little about youself.
                </span>
              </h2>
              <div className="mt-6 flex w-full max-w-xl flex-col space-y-6 lg:mt-4 lg:max-w-onboard-content-container lg:space-y-4">
                <div className="w-full">
                  <label className="label-form">Date of Birth</label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="birthYear"
                      name="birthYear"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="Year"
                      disabled={isDisabled}
                      className="input-form w-1/3"
                      required
                    >
                      <>
                        <option value="" disabled>
                          Year
                        </option>
                        {BIRTH_YEAR_RANGE.map((year) => {
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </>
                    </select>
                    <select
                      id="birthMonth"
                      name="birthMonth"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      placeholder="Month"
                      disabled={isDisabled}
                      className="input-form w-1/3"
                      required
                    >
                      <>
                        <option value="" disabled>
                          Month
                        </option>
                        {MONTH_INDEX_SHORT.map((name, value) => {
                          return (
                            <option key={name} value={value}>
                              {name}
                            </option>
                          );
                        })}
                      </>
                    </select>
                    <select
                      id="birthDay"
                      name="birthDay"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      placeholder="Day"
                      disabled={isDisabled}
                      className="input-form w-1/3"
                      required
                    >
                      <>
                        <option value="" disabled>
                          Day
                        </option>
                        {daysOfMonth.map((day) => {
                          return (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          );
                        })}
                      </>
                    </select>
                  </div>
                </div>
                {/* {!!tennisRatingScales && (
                  <div className="w-full">
                    <label className="label-form" htmlFor="rating-scale">
                      Rating scale
                    </label>
                    <select
                      id="rating-scale"
                      name="rating-scale"
                      value={ratingScale || ''}
                      onChange={(e) => setRatingScale(e.target.value)}
                      placeholder="Choose rating system"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    >
                      <option disabled value="">
                        Choose rating system
                      </option>
                      {tennisRatingScales.map((scale) => {
                        return (
                          <option key={scale.id} value={scale.id}>
                            {scale.shortName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {!!tennisRatingScales && (
                  <div className="w-full">
                    <label className="label-form" htmlFor="rating">
                      Rating
                    </label>
                    <input
                      id="rating"
                      name="rating"
                      value={rating || ''}
                      onChange={(e) => setRating(e.target.value.trim())}
                      type="number"
                      onWheel={(e) => {
                        // NOTE: Prevent wheel scroll from changing number
                        e.preventDefault();
                        e.currentTarget.blur();
                        return false;
                      }}
                      placeholder={
                        activeRatingScale
                          ? `${activeRatingScale.minimum} - ${activeRatingScale.maximum}`
                          : '0.0'
                      }
                      min={activeRatingScale ? activeRatingScale.minimum : 0}
                      max={activeRatingScale ? activeRatingScale.maximum : 100}
                      step="0.01"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    />
                  </div>
                )} */}
                <div className="w-full">
                  <label className="label-form" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    value={gender || ''}
                    onChange={(e) => setGender(e.target.value as GenderEnum)}
                    placeholder="Not chosen"
                    disabled={isDisabled}
                    className="input-form"
                    required
                  >
                    <option disabled value="">
                      Not chosen
                    </option>
                    <option value={GenderEnum.Female}>Female</option>
                    <option value={GenderEnum.Male}>Male</option>
                    <option value={GenderEnum.Preferred}>State gender preference</option>
                    <option value={GenderEnum.Private}>Choose not to disclose</option>
                  </select>
                  {gender === GenderEnum.Preferred && (
                    <div className="mt-3">
                      <input
                        className="input-form"
                        onChange={(e) => setPreferredGender(e.target.value)}
                        value={preferredGender}
                        placeholder="Preferred gender"
                        disabled={isDisabled}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 px-6 pb-4">
            <OnboardNextButton isDisabled={isDisabled || isImageUploading} />
          </div>
        </form>
      </OnboardingPage>
    </>
  );
};

export default OnboardBio;
