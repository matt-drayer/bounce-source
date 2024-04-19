import React from 'react';
import { RadioGroup } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import { addMinutes, differenceInMinutes, format, set } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { NEW_PLAY_SESSION_PAGE, getNewPlaySessionPreviewPageUrl } from 'constants/pages';
import { DUPR_PRESETS } from 'constants/sports';
import {
  defaultFormatForSport,
  defaultNameForLessonType,
  equipmentOrder,
  lessonDisplayName,
} from 'constants/sports';
import { DEFAULT_VENUE_IMAGE } from 'constants/venues';
import {
  LessonTypesEnum,
  PlaySessionCourtBookingStatusesEnum,
  PlaySessionFormatsEnum,
  PlaySessionMatchCompetitivenessEnum,
  PlaySessionPrivacyEnum,
  PlaySessionStatusesEnum,
  SportsEnum,
  useGetGroupVenuesLazyQuery,
  useGetPlaySessionByIdLazyQuery,
  useGetSkillLevelsQuery,
  useGetSportsRatingScalesQuery,
  useGetUserCustomCourtsLazyQuery,
  useInsertNewLessonWithExistingCourtMutation,
  useInsertNewPlaySessionMutation,
  useUpdateExistingPlaySessionByIdMutation,
  useUpdateNewPlaySessionByIdMutation,
  useUpdateUserDefaultSportMutation,
} from 'types/generated/client';
import { fixIosValidationScrollBug } from 'utils/mobile/fixIosValidationScrollBug';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import InfoCircle from 'svg/InfoCircle';
import SafeAreaPage from 'layouts/SafeAreaPage';
import ButtonSelector from 'components/ButtonSelector';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import TransitionFadeIn from 'components/TransitionFadeIn';
import Switch from 'components/forms/Switch';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import FormSection from './FormSection';
import ModalNewCourt from './ModalNewCourt';
import { TemplateButton } from './styles';

const NEW_PLAY_SESSION_FORM_ID = 'new-play-session-form';
const DEFAULT_RATING_SCALE_SHORT_NAME = 'DUPR';
const IS_HIDE_SIDEBAR = true;
const IS_USING_CUSTOM_COURTS = false;
const DEFAULT_DURATION_MINUTES = 60;
const DEFAULT_SINGLES_LIMIT = 1;
const DEFAULT_DOUBLES_LIMIT = 3;
const DEFAULT_OPEN_PLAY_LIMIT = 16;
const defaultParticipantLimitForFormat = {
  [PlaySessionFormatsEnum.Singles]: DEFAULT_SINGLES_LIMIT,
  [PlaySessionFormatsEnum.Doubles]: DEFAULT_DOUBLES_LIMIT,
  [PlaySessionFormatsEnum.OpenPlay]: DEFAULT_OPEN_PLAY_LIMIT,
};
const INDEX_FOR_CUSTOM_RATING = 0;
const INDEX_FOR_ALL_LEVELS = 1;
const ERROR_STRING =
  'There was an issue creating your play session. Please try again or contact support@bounce.game';

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];
const AM_TIME = 'AM';
const PM_TIME = 'PM';

interface Props {
  isNewPlaySession: boolean;
}

interface FormatTimeInputParams {
  hours: string;
  minutes: string;
  ampm: string;
}
const formatTimeInput = ({ hours, minutes, ampm }: FormatTimeInputParams) => {
  const minutesNumber = minutes ? parseInt(minutes, 10) : 0;
  let hourNumber = hours ? parseInt(hours, 10) : 0;

  if (ampm === PM_TIME && hourNumber < 12) {
    hourNumber = hourNumber + 12;
  }
  if (ampm === AM_TIME && hourNumber === 12) {
    hourNumber = 0;
  }

  const hoursString = `${hourNumber}`.padStart(2, '0');
  const minutesString = `${minutesNumber}`.padStart(2, '0');

  return `${hoursString}:${minutesString}`;
};

export default function PlaySessionEditor({ isNewPlaySession }: Props) {
  const router = useRouter();
  const viewer = useViewer();
  const { data: skillLevelsData, loading: isGetSkillLevelsLoading } = useGetSkillLevelsQuery();
  const { user, loading: isCurrentUserLoading, called: isCurrentUserCalled } = useGetCurrentUser();
  const { data: sportsRatingScalesData, loading: isSportsRatingScalesLoading } =
    useGetSportsRatingScalesQuery();
  const [
    fetchExistingPlaySession,
    { data: existingPlaySessionData, loading: isFetchingExisingPlaySession },
  ] = useGetPlaySessionByIdLazyQuery();
  const [
    fetchCustomCourts,
    { data, loading: isFetchingCustomCourts, refetch: refetchCustomCourts },
  ] = useGetUserCustomCourtsLazyQuery();
  const [getGroupVenuesLazyQuery, { data: groupVenueData, loading: isGroupVenueLoading }] =
    useGetGroupVenuesLazyQuery();
  const [updateUserDefaultSportMutation] = useUpdateUserDefaultSportMutation();
  const [insertNewPlaySessionMutation, { loading: isInsertSessionLoading }] =
    useInsertNewPlaySessionMutation();
  const [updateNewPlaySessionById, { loading: isUpdateNewPlaySessionLoading }] =
    useUpdateNewPlaySessionByIdMutation();
  const [updateExistingPlaySessionById, { loading: isUpdateExistingPlaySessionLoading }] =
    useUpdateExistingPlaySessionByIdMutation();
  const [isCourtModalOpen, setIsCourtModalOpen] = React.useState(false);
  const [existingPlaySessionId, setExistingPlaySessionId] = React.useState('');
  const [playSessionSport, setPlaySessionSport] = React.useState(SportsEnum.Tennis);
  const [playSessionTitle, setPlaySessionTitle] = React.useState('');
  const [hasTouchedTitle, setHasTouchedTitle] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [startHours, setStartHours] = React.useState('');
  const [startMinutes, setStartMinutes] = React.useState('00');
  const [startAmPm, setStartAmPm] = React.useState(AM_TIME);
  const [durationMinutes, setDurationMinutes] = React.useState(DEFAULT_DURATION_MINUTES);
  const [activeCourtId, setActiveCourtId] = React.useState('');
  const [hasUpdatedParticipantLimit, setHasUpdatedParticipantLimit] = React.useState(false);
  const [hasParticipantLimit, setHasParticipantLimit] = React.useState(false);
  const [participantLimit, setParticipantLimit] = React.useState<number | string>(0);
  const [description, setDescription] = React.useState('');
  const [playSessionFormat, setPlaySessionFormat] = React.useState(PlaySessionFormatsEnum.OpenPlay);
  const [playSessionCompetitiveness, setPlaySessionCompetitiveness] = React.useState(
    PlaySessionMatchCompetitivenessEnum.Casual,
  );
  const [playSessionSkillLevelIndex, setPlaySessionSkillLevelIndex] = React.useState(0);
  const [skillLevelMin, setSkillLevelMin] = React.useState('');
  const [skillLevelMax, setSkillLevelMax] = React.useState('');
  const [privacy, setPrivacy] = React.useState(PlaySessionPrivacyEnum.Public);
  const [bookingStatus, setBookingStatus] = React.useState(
    PlaySessionCourtBookingStatusesEnum.Booked,
  );
  const [isBringingExtraRackets, setIsBringingExtraRackets] = React.useState(false);
  const [extraRacketCount, setExtraRacketCount] = React.useState<number | string>(0);
  const [isBringingNet, setIsBringingNet] = React.useState(false);
  const isDateSolid = !!date;
  const formattedStartTime = formatTimeInput({
    hours: startHours,
    minutes: startMinutes,
    ampm: startAmPm,
  });
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Date();
  const timezoneOffsetMinutes = Math.round(currentDate.getTimezoneOffset());
  const timezoneAbbreviation = currentDate
    .toLocaleString('en', { timeZoneName: 'short' })
    .split(' ')
    .pop();
  const groupId = user?.groups?.[0]?.group?.id;
  const courts = React.useMemo(
    () =>
      groupVenueData?.groupVenues
        ?.map((venue) => venue.venue)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || [],
    [groupVenueData?.groupVenues],
  );
  const isViewerLoading =
    viewer.status === AuthStatus.Loading ||
    isCurrentUserLoading ||
    !isCurrentUserCalled ||
    isGetSkillLevelsLoading;
  const isDisabled =
    isFetchingExisingPlaySession ||
    isSportsRatingScalesLoading ||
    isFetchingCustomCourts ||
    isViewerLoading ||
    isInsertSessionLoading;

  React.useEffect(() => {
    if (viewer.userId && IS_USING_CUSTOM_COURTS) {
      fetchCustomCourts({
        variables: { id: viewer.userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      });
    }
  }, [viewer.userId]);

  React.useEffect(() => {
    if (groupId) {
      getGroupVenuesLazyQuery({
        variables: { groupId: groupId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      });
    }
  }, [groupId]);

  React.useEffect(() => {
    if (courts && courts.length && !activeCourtId) {
      console.log('===== changing courts =====');
      setActiveCourtId(courts[0].id);
    }
  }, [courts, activeCourtId]);

  React.useEffect(() => {
    if (isNewPlaySession) {
      if (user?.defaultSport) {
        setPlaySessionSport(user.defaultSport);
        setPlaySessionFormat(defaultFormatForSport[user.defaultSport]);

        const format = defaultFormatForSport[user.defaultSport];
        setParticipantLimit(defaultParticipantLimitForFormat[format]);
      }

      // if (user?.defaultSport === SportsEnum.Tennis && user?.tennisSkillLevel?.id) {
      //   setPlaySessionSkillLevelIndex(user?.tennisSkillLevel?.id);
      // } else if (user?.defaultSport === SportsEnum.Pickleball && user?.pickleballSkillLevel?.id) {
      //   setPlaySessionSkillLevelIndex(user?.pickleballSkillLevel?.id);
      // }
    }
  }, [user, isNewPlaySession]);

  React.useEffect(() => {
    if (router.isReady) {
      const datetime = router.query.datetime;

      if (datetime && typeof datetime === 'string') {
        const parsedPlaySessionDate = new Date(parseInt(datetime, 10));
        const date = format(parsedPlaySessionDate, 'yyyy-MM-dd');
        const timeFullString = format(parsedPlaySessionDate, 'p');
        const [timeNumberString, ampm] = timeFullString.split(' ');
        const [hourString, minuteString] = timeNumberString.split(':');
        const formattedHourString = hourString[0] === '0' ? hourString[1] : hourString;

        setDate(date);
        setStartHours(formattedHourString);
        setStartMinutes(minuteString);
        setStartAmPm(ampm);
      }
    }
  }, [router.isReady]);

  React.useEffect(() => {
    const fetchPlaySession = async (id: string) => {
      try {
        const response = await fetchExistingPlaySession({
          variables: { id },
        });
        const playSession = response.data?.playSessionsByPk;

        if (playSession) {
          const startDateObject = new Date(playSession.startDateTime);
          const endDateObject = new Date(playSession.endDateTime);
          const startDate = format(startDateObject, 'yyyy-MM-dd');
          const timeFullString = format(startDateObject, 'p');
          const [timeNumberString, ampm] = timeFullString.split(' ');
          const [hourString, minuteString] = timeNumberString.split(':');
          const formattedHourString = hourString[0] === '0' ? hourString[1] : hourString;
          const duration = differenceInMinutes(endDateObject, startDateObject);

          // setPlaySessionType(playSession.type);
          setPlaySessionTitle(playSession.title);
          setHasTouchedTitle(true);
          setDate(startDate);
          setStartHours(formattedHourString);
          setStartMinutes(minuteString);
          setStartAmPm(ampm);
          setDurationMinutes(duration);
          // setCourtId(playSession.userCustomCourtId || '');
          setParticipantLimit(
            playSession.participantLimit ||
              // DefaultParticipantLimitByClassType[playSession.type] ||
              1,
          );

          if (playSession?.venue?.id) {
            setActiveCourtId(playSession.venue.id);
          }

          if (playSession.participantLimit) {
            setHasParticipantLimit(true);
          }

          setDescription(playSession.description);
          setPlaySessionSport(playSession.sport);
          setPlaySessionFormat(playSession.format || defaultFormatForSport[playSession.sport]);
          setSkillLevelMax(playSession.skillRatingMaximum?.toFixed(2) || '');
          setSkillLevelMin(playSession.skillRatingMinimum?.toFixed(2) || '');
          setPrivacy(playSession.privacy);
          // setPlaySessionSkillLevelIndex(playSession.targetSkillLevel || '');
          setBookingStatus(playSession.courtBookingStatus);
          setIsBringingExtraRackets(!!playSession.extraRacketCount);
          setExtraRacketCount(playSession.extraRacketCount || 0);
          setIsBringingNet(!!playSession.isBringingNet);

          const skillSetPresetIndex = DUPR_PRESETS.findLastIndex(
            (p) =>
              p.min === playSession.skillRatingMinimum && p.max === playSession.skillRatingMaximum,
          );

          if (skillSetPresetIndex > -1) {
            setPlaySessionSkillLevelIndex(skillSetPresetIndex);
          }

          if (playSession.competitiveness) {
            setPlaySessionCompetitiveness(playSession.competitiveness);
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.userId) {
      const existingPlaySessionId = router.query.playSessionId || router.query.newPlaySessionId;
      if (existingPlaySessionId && typeof existingPlaySessionId === 'string') {
        setExistingPlaySessionId(existingPlaySessionId);
        fetchPlaySession(existingPlaySessionId);
      }
    }
  }, [router.isReady, viewer.userId]);

  return (
    <>
      <Head
        title={isNewPlaySession ? 'New Play Session' : 'Edit Play Session'}
        description="Create a play session on Bounce"
      />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <form
          id={NEW_PLAY_SESSION_FORM_ID}
          className="flex h-full grow flex-col"
          onSubmit={async (e) => {
            e.preventDefault();

            const primaryGroup = user?.groups?.[0]?.group;
            const sport = primaryGroup?.primarySport || SportsEnum.Pickleball;
            const tennisRatingScale = sportsRatingScalesData?.tennisRatingScales.find(
              (scale) => scale.shortName === DEFAULT_RATING_SCALE_SHORT_NAME,
            );
            const pickleballRatingScale = sportsRatingScalesData?.pickleballRatingScales.find(
              (scale) => scale.shortName === DEFAULT_RATING_SCALE_SHORT_NAME,
            );
            let playSessionId = '';

            console.log({ primaryGroup });

            try {
              const startDateTime = set(new Date(), {
                year: parseInt(date.split('-')[0], 10),
                month: parseInt(date.split('-')[1], 10) - 1,
                date: parseInt(date.split('-')[2], 10),
                hours: parseInt(formattedStartTime.split(':')[0], 10),
                minutes: parseInt(formattedStartTime.split(':')[1], 10),
                seconds: 0,
                milliseconds: 0,
              });
              const endDateTime = addMinutes(startDateTime, durationMinutes);
              const existingPlaySession = existingPlaySessionData?.playSessionsByPk;
              const isUpdateExistingPLaySession = !!existingPlaySessionId && !!existingPlaySession;
              const participantLimitOrUnlimited = hasParticipantLimit
                ? !participantLimit && participantLimit !== 0
                  ? null
                  : // @ts-expect-error It may already be converted but that's a noop
                    parseInt(participantLimit, 10)
                : null;

              const variables = {
                title: playSessionTitle,
                startDateTime,
                endDateTime,
                competitiveness: playSessionCompetitiveness,
                description: description.trim() || '',
                sport: sport,
                format: playSessionFormat,
                targetSkillLevel: null,
                participantLimit: participantLimitOrUnlimited,
                courtBookingStatus: bookingStatus,
                userCustomCourtId: null,
                extraRacketCount:
                  typeof extraRacketCount === 'string'
                    ? parseInt(extraRacketCount, 10) || 0
                    : extraRacketCount,
                isBringingNet: isBringingNet || false,
                privacy,
                groupId: primaryGroup?.id || null,
                skillRatingMaximum: skillLevelMax ? parseFloat(skillLevelMax) : null,
                skillRatingMinimum: skillLevelMin ? parseFloat(skillLevelMin) : null,
                pickleballRatingScaleId: pickleballRatingScale?.id || null,
                tennisRatingScaleId: tennisRatingScale?.id || null,
                venueId: activeCourtId || null,
              };

              // NOTE: End early since you're updating a published play session
              if (!isNewPlaySession && existingPlaySessionId) {
                try {
                  await updateExistingPlaySessionById({
                    variables: {
                      playSessionId: existingPlaySessionId,
                      ...variables,
                    },
                  });
                  return router.back();
                } catch (error) {
                  Sentry.captureException(error);
                  toast.error('Error updating play session');
                  return;
                }
              }

              try {
                if (isUpdateExistingPLaySession) {
                  const response = await updateNewPlaySessionById({
                    variables: {
                      playSessionId: existingPlaySessionId,
                      ...variables,
                      status: PlaySessionStatusesEnum.Pending,
                      commentObjects: description.trim()
                        ? [
                            {
                              playSessionId: existingPlaySessionId,
                              content: description.trim(),
                              userId: viewer.userId,
                            },
                          ]
                        : [],
                    },
                  });
                  if (response.errors) {
                    Sentry.captureException(response.errors);
                    throw new Error('GraphQL errors');
                  }
                  playSessionId = existingPlaySessionId;
                } else {
                  const response = await insertNewPlaySessionMutation({
                    variables: {
                      ...variables,
                      locale: getNavigatorLanguage(),
                      timezoneName,
                      timezoneAbbreviation: timezoneAbbreviation || '',
                      timezoneOffsetMinutes,
                      organizerUserId: viewer.userId,
                      status: PlaySessionStatusesEnum.Pending,
                      commentData: description.trim()
                        ? [{ content: description.trim(), userId: viewer.userId }]
                        : [],
                      data: groupId ? [{ groupId }] : [],
                    },
                  });
                  if (response.errors) {
                    Sentry.captureException(response.errors);
                    throw new Error('GraphQL errors');
                  }
                  const playSession = response.data?.insertPlaySessionsOne;
                  playSessionId = playSession?.id;
                }

                if (viewer.userId && playSessionSport) {
                  updateUserDefaultSportMutation({
                    variables: {
                      id: viewer.userId,
                      defaultSport: sport,
                    },
                  }).catch((error) => Sentry.captureException(error));
                }

                if (playSessionId) {
                  const playSessionPreviewUrl = getNewPlaySessionPreviewPageUrl(playSessionId);
                  // NOTE: If they hit the back button, this ensures they see the previous play session to edit
                  await router.replace(
                    `${NEW_PLAY_SESSION_PAGE}?newPlaySessionId=${playSessionId}`,
                    undefined,
                    {
                      shallow: true,
                    },
                  );
                  router.push(playSessionPreviewUrl);
                } else {
                  toast.error(ERROR_STRING);
                }
              } catch (error) {
                Sentry.captureException(error);
                toast.error(ERROR_STRING);
              }
            } catch (error) {
              Sentry.captureException(error);
              toast.error(ERROR_STRING);
            }
          }}
        >
          <div className="relative h-full grow">
            <div className="flex h-full w-full grow flex-col items-center">
              <div className="bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
                <FixedPageTitle
                  title={isNewPlaySession ? 'New session' : 'Modify session'}
                  isPop
                  isBackdropBlur
                  isHideSidebar={IS_HIDE_SIDEBAR}
                  right={
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="button-rounded-inline-primary px-4 text-xs font-semibold"
                    >
                      {isNewPlaySession ? 'Continue' : 'Save'}
                    </button>
                  }
                />
              </div>
              <div className="flex h-full w-full grow flex-col pb-16">
                {/* {isNewPlaySession && (
                  <div className="mb-4 w-full lg:mx-auto lg:max-w-main-content-container">
                    <FormSection>
                      <div className="px-6 lg:px-0">
                        <label
                          htmlFor="play-session-skill-level"
                          className="label-form lg:text-xl lg:font-semibold"
                        >
                          Templates
                        </label>
                      </div>
                      <div className="flex w-full flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 pb-4 lg:mb-0 lg:grid lg:max-w-[520px] lg:grid-cols-6 lg:gap-2 lg:space-x-0 lg:overflow-auto lg:px-0 lg:pb-2">
                        <TemplateButton
                          type="button"
                          className={classNames(
                            'flex h-20 w-20 flex-initial items-center justify-center rounded-md px-1 text-xs transition-all duration-150',
                            true
                              ? 'bg-color-button-brand-primary text-color-text-darkmode-primary shadow-option-active'
                              : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                          )}
                          onClick={() => {
                            alert('ADD OPEN PLAY TEMPLATES');
                          }}
                        >
                          Todo
                        </TemplateButton>
                      </div>
                    </FormSection>
                  </div>
                )} */}
                <div className="mb-8 w-full lg:mx-auto lg:max-w-main-content-container">
                  <FormSection>
                    <div className="px-6 lg:px-0">
                      <label
                        htmlFor="play-session-skill-level"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Player rating
                      </label>
                    </div>
                    <div className="w-full lg:max-w-[520px]">
                      <div className="flex w-full flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 pb-4 lg:mb-0 lg:grid lg:max-w-[520px] lg:grid-cols-6 lg:gap-2 lg:space-x-0 lg:overflow-auto lg:px-0 lg:pb-2">
                        {DUPR_PRESETS.map((preset, index) => {
                          return (
                            <TemplateButton
                              key={index}
                              type="button"
                              className={classNames(
                                'flex h-20 w-20 flex-initial items-center justify-center rounded-md px-1 text-xs transition-all duration-150',
                                index === playSessionSkillLevelIndex
                                  ? 'bg-color-button-brand-primary text-color-text-darkmode-primary shadow-option-active'
                                  : 'bg-color-bg-input-lightmode-primary text-color-text-lightmode-secondary dark:bg-color-bg-input-darkmode-primary dark:text-color-text-darkmode-secondary',
                              )}
                              onClick={() => {
                                setPlaySessionSkillLevelIndex(index);

                                if (preset.isRange) {
                                  setSkillLevelMin(preset.min ? preset.min.toFixed(2) : '');
                                  setSkillLevelMax(preset.max ? preset.max.toFixed(2) : '');
                                }
                              }}
                            >
                              <div className="space-y-1.5 font-semibold">
                                {!!preset.scaleTitle && <div>{preset.scaleTitle}</div>}
                                {!!preset.displayName && <div>{preset.displayName}</div>}
                                {(!!preset.min || !!preset.max) && (
                                  <div>
                                    {preset.min?.toFixed(2)}-{preset.max?.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </TemplateButton>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex items-center space-x-1 px-6 lg:px-0">
                        {playSessionSkillLevelIndex === INDEX_FOR_ALL_LEVELS ? (
                          <div className="input-form text-center opacity-70">All levels</div>
                        ) : (
                          <>
                            <input
                              id="play-session-rating-min"
                              name="play-session-rating-min"
                              type="number"
                              onWheel={(e) => {
                                // NOTE: Prevent wheel scroll from changing number
                                e.preventDefault();
                                e.currentTarget.blur();
                                return false;
                              }}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              disabled={isDisabled}
                              className={classNames(
                                'input-form w-1/2 text-center focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                              )}
                              value={skillLevelMin || ''}
                              onChange={(e) => {
                                setSkillLevelMin(e.target.value);
                                setPlaySessionSkillLevelIndex(INDEX_FOR_CUSTOM_RATING);
                              }}
                              onFocus={fixIosValidationScrollBug}
                              required
                            />
                            <span>-</span>
                            <input
                              id="play-session-rating-max"
                              name="play-session-rating-max"
                              type="number"
                              onWheel={(e) => {
                                // NOTE: Prevent wheel scroll from changing number
                                e.preventDefault();
                                e.currentTarget.blur();
                                return false;
                              }}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              disabled={isDisabled}
                              className={classNames(
                                'input-form w-1/2 text-center focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                              )}
                              value={skillLevelMax || ''}
                              onChange={(e) => {
                                setSkillLevelMax(e.target.value);
                                setPlaySessionSkillLevelIndex(INDEX_FOR_CUSTOM_RATING);
                              }}
                              onFocus={fixIosValidationScrollBug}
                              required
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </FormSection>
                </div>
                <div className="w-full space-y-8 lg:mx-auto lg:max-w-main-content-container lg:space-y-0">
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-sport"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Sport
                      </label>
                      <div className="min-h-[40px] w-full lg:max-w-[520px]">
                        <TransitionFadeIn isShowing={!isViewerLoading}>
                          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                            <div className="flex h-10 w-full text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setPlaySessionSport(SportsEnum.Tennis);
                                  setPlaySessionFormat(defaultFormatForSport[SportsEnum.Tennis]);
                                }}
                                isActive={playSessionSport === SportsEnum.Tennis}
                              >
                                Tennis
                              </ButtonSelector>
                            </div>
                            <div className="flex h-10 w-full text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setPlaySessionSport(SportsEnum.Pickleball);
                                  setPlaySessionFormat(
                                    defaultFormatForSport[SportsEnum.Pickleball],
                                  );
                                }}
                                isActive={playSessionSport === SportsEnum.Pickleball}
                              >
                                Pickleball
                              </ButtonSelector>
                            </div>
                          </div>
                        </TransitionFadeIn>
                      </div>
                    </FormSection> */}
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-format"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Format
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <TransitionFadeIn isShowing={!isViewerLoading}>
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-1/3 text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setPlaySessionFormat(PlaySessionFormatsEnum.Singles);
                                  setParticipantLimit(DEFAULT_SINGLES_LIMIT);
                                }}
                                isActive={playSessionFormat === PlaySessionFormatsEnum.Singles}
                              >
                                Singles
                              </ButtonSelector>
                            </div>
                            <div className="flex h-10 w-1/3 text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setPlaySessionFormat(PlaySessionFormatsEnum.Doubles);
                                  setParticipantLimit(DEFAULT_DOUBLES_LIMIT);
                                }}
                                isActive={playSessionFormat === PlaySessionFormatsEnum.Doubles}
                              >
                                Doubles
                              </ButtonSelector>
                            </div>
                            <div className="flex h-10 w-1/3 text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setPlaySessionFormat(PlaySessionFormatsEnum.OpenPlay);
                                  setParticipantLimit(DEFAULT_OPEN_PLAY_LIMIT);
                                }}
                                isActive={playSessionFormat === PlaySessionFormatsEnum.OpenPlay}
                              >
                                Open Play
                              </ButtonSelector>
                            </div>
                          </div>
                        </TransitionFadeIn>
                      </div>
                    </FormSection> */}
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-skill-level"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Skill level
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <TransitionFadeIn isShowing={!isViewerLoading}>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex h-10 w-full text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => setPlaySessionSkillLevelIndex('')}
                                isActive={!playSessionSkillLevelIndex}
                              >
                                All Levels
                              </ButtonSelector>
                            </div>
                            {skillLevelsData?.skillLevels
                              .filter((s) => s.isDisplayed)
                              .map((skillLevel) => (
                                <div
                                  key={skillLevel.id}
                                  className="flex h-10 w-full text-sm lg:text-base"
                                >
                                  <ButtonSelector
                                    onClick={() => setPlaySessionSkillLevelIndex(skillLevel.id)}
                                    isActive={playSessionSkillLevelIndex === skillLevel.id}
                                  >
                                    {skillLevel.displayName}
                                  </ButtonSelector>
                                </div>
                              ))}
                          </div>
                        </TransitionFadeIn>
                      </div>
                    </FormSection> */}
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-match-type"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Session type
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-1/3 text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setPlaySessionCompetitiveness(
                                  PlaySessionMatchCompetitivenessEnum.Casual,
                                );
                              }}
                              isActive={
                                playSessionCompetitiveness ===
                                PlaySessionMatchCompetitivenessEnum.Casual
                              }
                            >
                              Casual
                            </ButtonSelector>
                          </div>
                          <div className="flex h-10 w-1/3 text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setPlaySessionCompetitiveness(
                                  PlaySessionMatchCompetitivenessEnum.Practice,
                                );
                              }}
                              isActive={
                                playSessionCompetitiveness ===
                                PlaySessionMatchCompetitivenessEnum.Practice
                              }
                            >
                              Practice
                            </ButtonSelector>
                          </div>
                          <div className="flex h-10 w-1/3 text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setPlaySessionCompetitiveness(
                                  PlaySessionMatchCompetitivenessEnum.Match,
                                );
                              }}
                              isActive={
                                playSessionCompetitiveness ===
                                PlaySessionMatchCompetitivenessEnum.Match
                              }
                            >
                              Match
                            </ButtonSelector>
                          </div>
                        </div>
                      </div>
                    </FormSection> */}
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-court-booking-status"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Court booking status
                      </label>
                      <div className="min-h-[40px] w-full lg:max-w-[520px]">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                          <div className="flex h-10 w-full text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setBookingStatus(PlaySessionCourtBookingStatusesEnum.Booked);
                              }}
                              isActive={
                                bookingStatus === PlaySessionCourtBookingStatusesEnum.Booked
                              }
                            >
                              Booked
                            </ButtonSelector>
                          </div>
                          <div className="flex h-10 w-full text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setBookingStatus(PlaySessionCourtBookingStatusesEnum.NotBooked);
                              }}
                              isActive={
                                bookingStatus === PlaySessionCourtBookingStatusesEnum.NotBooked
                              }
                            >
                              Not Booked
                            </ButtonSelector>
                          </div>
                        </div>
                      </div>
                    </FormSection> */}
                  {/* {playSessionSport === SportsEnum.Pickleball && (
                      <FormSection>
                        <label
                          htmlFor="play-session-net"
                          className="label-form lg:text-xl lg:font-semibold"
                        >
                          Are you bringing a net?
                        </label>
                        <div className="min-h-[40px] w-full lg:max-w-[520px]">
                          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                            <div className="flex h-10 w-full text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setIsBringingNet(false);
                                }}
                                isActive={!isBringingNet}
                              >
                                No
                              </ButtonSelector>
                            </div>
                            <div className="flex h-10 w-full text-sm lg:text-base">
                              <ButtonSelector
                                onClick={() => {
                                  setIsBringingNet(true);
                                }}
                                isActive={isBringingNet}
                              >
                                Yes
                              </ButtonSelector>
                            </div>
                          </div>
                        </div>
                      </FormSection>
                    )} */}
                  {/* <FormSection>
                      <label
                        htmlFor="play-session-extra-rackets"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Are you bringing extra{' '}
                        {playSessionSport === SportsEnum.Tennis ? 'rackets' : 'paddles'}?
                      </label>
                      <div className="min-h-[40px] w-full lg:max-w-[520px]">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                          <div className="flex h-10 w-full text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setIsBringingExtraRackets(false);
                                setExtraRacketCount(0);
                              }}
                              isActive={!isBringingExtraRackets}
                            >
                              No
                            </ButtonSelector>
                          </div>
                          <div className="flex h-10 w-full text-sm lg:text-base">
                            <ButtonSelector
                              onClick={() => {
                                setIsBringingExtraRackets(true);
                              }}
                              isActive={isBringingExtraRackets}
                            >
                              Yes
                            </ButtonSelector>
                          </div>
                        </div>
                      </div>
                    </FormSection> */}
                  {/* {isBringingExtraRackets && (
                      <FormSection>
                        <div className="flex space-x-3">
                          <label
                            htmlFor="play-session-extra-racket-count"
                            className="label-form lg:mb-0 lg:text-xl lg:font-semibold"
                          >
                            How many extra{' '}
                            {playSessionSport === SportsEnum.Tennis ? 'rackets' : 'paddles'}?
                          </label>
                        </div>
                        <div className="w-full lg:max-w-[520px]">
                          <input
                            id="play-session-extra-racket-count"
                            name="play-session-extra-racket-count"
                            type="number"
                            placeholder={`Number of extra ${
                              playSessionSport === SportsEnum.Tennis ? 'rackets' : 'paddles'
                            }`}
                            className="input-form"
                            value={extraRacketCount}
                            disabled={isDisabled}
                            min={0}
                            onChange={(e) => {
                              setExtraRacketCount(
                                e.target.value !== '' ? parseInt(e.target.value, 10) : '',
                              );
                            }}
                            onFocus={fixIosValidationScrollBug}
                            required
                          />
                        </div>
                      </FormSection>
                    )} */}
                  <FormSection className="px-6 lg:px-0">
                    <label
                      htmlFor="play-session-date"
                      className="label-form lg:text-xl lg:font-semibold"
                    >
                      Date
                    </label>
                    <div className="w-full lg:max-w-[520px]">
                      <input
                        id="play-session-date"
                        name="play-session-date"
                        type="date"
                        placeholder="Choose a date"
                        className={classNames(
                          'input-form focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary dark:focus:text-color-text-darkmode-primary',
                          isDateSolid
                            ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                            : 'dark:color-text-darkmode-placeholder text-color-text-lightmode-placeholder',
                        )}
                        value={date}
                        disabled={isDisabled || !isNewPlaySession}
                        onChange={(e) => setDate(e.target.value)}
                        onFocus={fixIosValidationScrollBug}
                        required
                      />
                    </div>
                  </FormSection>
                  <FormSection className="px-6 lg:px-0">
                    <label className="label-form lg:text-xl lg:font-semibold">Start time</label>
                    <div className="w-full lg:max-w-[520px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-1/3">
                          <select
                            id="play-session-start-hour"
                            name="play-session-start-hour"
                            value={startHours}
                            onChange={(e) => {
                              setStartHours(e.target.value);
                            }}
                            placeholder="Hour"
                            disabled={isDisabled}
                            className="input-form"
                            onFocus={fixIosValidationScrollBug}
                            required
                          >
                            <option value="" disabled>
                              Time
                            </option>
                            {HOURS.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="shrink-0">:</div>
                        <div className="w-1/3">
                          <select
                            id="play-session-start-minute"
                            name="play-session-start-minute"
                            value={startMinutes}
                            onChange={(e) => {
                              setStartMinutes(e.target.value);
                            }}
                            placeholder="Min"
                            disabled={isDisabled}
                            className="input-form"
                            onFocus={fixIosValidationScrollBug}
                            required
                          >
                            {MINUTES.map((min) => (
                              <option key={min} value={min}>
                                {min}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-1/3">
                          <select
                            id="play-session-start-ampm"
                            name="play-session-start-ampm"
                            value={startAmPm}
                            onChange={(e) => {
                              setStartAmPm(e.target.value);
                            }}
                            placeholder="AM PM"
                            disabled={isDisabled}
                            className="input-form"
                            required
                          >
                            <option value={AM_TIME}>{AM_TIME}</option>
                            <option value={PM_TIME}>{PM_TIME}</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-2 pl-1 text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                        Current timezone: {timezoneName}
                      </div>
                    </div>
                  </FormSection>
                  <FormSection className="px-6 lg:px-0">
                    <label
                      htmlFor="play-session-duration"
                      className="label-form lg:text-xl lg:font-semibold"
                    >
                      Duration
                    </label>
                    <div className="w-full lg:max-w-[520px]">
                      <select
                        id="play-session-duration"
                        name="play-session-duration"
                        value={durationMinutes}
                        onChange={(e) => {
                          setDurationMinutes(parseInt(e.target.value, 10));
                        }}
                        placeholder="Not chosen"
                        disabled={isDisabled}
                        className="input-form"
                        onFocus={fixIosValidationScrollBug}
                        required
                      >
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1 hr 30 min</option>
                        <option value={120}>2 hours</option>
                        <option value={150}>2 hr 30 min</option>
                        <option value={180}>3 hours</option>
                        <option value={210}>3 hr 30 min</option>
                        <option value={240}>4 hours</option>
                        <option value={300}>5 hours</option>
                        <option value={360}>6 hours</option>
                      </select>
                    </div>
                  </FormSection>
                  <FormSection className="px-6 lg:px-0">
                    <div className="flex space-x-3">
                      <label
                        htmlFor="play-session-title"
                        className="label-form lg:mb-0 lg:text-xl lg:font-semibold"
                      >
                        Title
                      </label>
                      {/* <div className="pt-[5px] text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:text-sm">
                        Optional
                      </div> */}
                    </div>
                    <div className="w-full lg:max-w-[520px]">
                      <input
                        id="play-session-title"
                        name="play-session-title"
                        type="text"
                        placeholder="Quick identifiable name"
                        className="input-form"
                        value={playSessionTitle}
                        disabled={isDisabled}
                        onChange={(e) => {
                          setHasTouchedTitle(true);
                          setPlaySessionTitle(e.target.value);
                        }}
                        onFocus={fixIosValidationScrollBug}
                        required
                      />
                    </div>
                  </FormSection>
                  <FormSection className="px-6 lg:px-0">
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="play-session-participant-limit"
                        className="label-form mb-0 flex items-center lg:text-xl lg:font-semibold"
                      >
                        Participant limit
                      </label>
                      <div className="block lg:hidden">
                        <Switch
                          isActive={hasParticipantLimit}
                          toggleIsActive={() => setHasParticipantLimit(!hasParticipantLimit)}
                        />
                      </div>
                    </div>
                    <div className="flex w-full items-center lg:max-w-[520px]">
                      <div className="mr-4 hidden lg:block">
                        <Switch
                          isActive={hasParticipantLimit}
                          toggleIsActive={() => setHasParticipantLimit(!hasParticipantLimit)}
                        />
                      </div>
                      {hasParticipantLimit ? (
                        <div className="flex w-full items-center space-x-3">
                          <button
                            type="button"
                            className="input-form flex h-10 w-1/5 items-center justify-center text-lg font-semibold"
                            disabled={isDisabled}
                            onClick={() => {
                              setHasUpdatedParticipantLimit(true);

                              if (typeof participantLimit !== 'number') {
                                setParticipantLimit(1);
                              } else if (participantLimit === 1) {
                                return;
                              } else {
                                setParticipantLimit(participantLimit - 1);
                              }
                            }}
                          >
                            -
                          </button>
                          <input
                            id="play-session-participant-limit"
                            name="play-session-participant-limit"
                            type="number"
                            onWheel={(e) => {
                              // NOTE: Prevent wheel scroll from changing number
                              e.preventDefault();
                              e.currentTarget.blur();
                              return false;
                            }}
                            placeholder="# of players"
                            step="1"
                            min="1"
                            disabled={isDisabled}
                            className={classNames(
                              'input-form w-3/5 text-center focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                            )}
                            value={participantLimit}
                            onChange={(e) => {
                              if (e.target.value === '') {
                                setParticipantLimit(e.target.value);
                                return;
                              }

                              const value = parseInt(e.target.value, 10);

                              if (value >= 0) {
                                setParticipantLimit(value);
                                setHasUpdatedParticipantLimit(true);
                              }
                            }}
                            onFocus={fixIosValidationScrollBug}
                            required
                          />
                          <button
                            type="button"
                            disabled={isDisabled}
                            className="input-form flex h-10 w-1/5 items-center justify-center text-lg"
                            onClick={() => {
                              setHasUpdatedParticipantLimit(true);

                              if (typeof participantLimit !== 'number') {
                                setParticipantLimit(1);
                              } else {
                                setParticipantLimit(participantLimit + 1);
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="input-form text-center opacity-70">Unlimited</div>
                      )}
                    </div>
                  </FormSection>
                  <FormSection className="px-6 lg:px-0">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="play-session-privacy"
                        className="label-form mb-0 flex items-center lg:text-xl lg:font-semibold"
                      >
                        Private
                      </label>
                      <div className="block lg:hidden">
                        <Switch
                          isActive={privacy === PlaySessionPrivacyEnum.Private}
                          toggleIsActive={() =>
                            setPrivacy(
                              privacy === PlaySessionPrivacyEnum.Private
                                ? PlaySessionPrivacyEnum.Public
                                : PlaySessionPrivacyEnum.Private,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex w-full lg:max-w-[520px]">
                      <div
                        className={classNames(
                          'mr-4 hidden shrink-0 lg:block',
                          privacy === PlaySessionPrivacyEnum.Private && 'pt-2',
                        )}
                      >
                        <Switch
                          isActive={privacy === PlaySessionPrivacyEnum.Private}
                          toggleIsActive={() =>
                            setPrivacy(
                              privacy === PlaySessionPrivacyEnum.Private
                                ? PlaySessionPrivacyEnum.Public
                                : PlaySessionPrivacyEnum.Private,
                            )
                          }
                        />
                      </div>
                      {privacy === PlaySessionPrivacyEnum.Private && (
                        <div className="mt-2 flex w-full rounded-md bg-brand-fire-100 p-4 text-sm text-brand-fire-500">
                          <InfoCircle className="mr-2.5 h-5 w-5 shrink-0" />
                          <span>
                            Private matches will not show up in the feed. Only players with a direct
                            link will find it.
                          </span>
                        </div>
                      )}
                    </div>
                  </FormSection>
                  {!!courts && courts.length > 0 && (
                    <div className="mb-8 w-full lg:mx-auto lg:max-w-main-content-container">
                      <FormSection>
                        <div className="px-6 lg:px-0">
                          <label
                            htmlFor="play-session-court"
                            className="label-form lg:text-xl lg:font-semibold"
                          >
                            Location
                          </label>
                        </div>
                        <RadioGroup
                          name="play-session-court"
                          value={activeCourtId}
                          onChange={setActiveCourtId}
                          className="flex w-full flex-nowrap space-x-4 overflow-x-auto overflow-y-visible px-6 pb-4 lg:mb-0 lg:grid lg:max-w-[520px] lg:grid-cols-3 lg:gap-4 lg:space-x-0 lg:overflow-auto lg:px-0 lg:pb-2"
                        >
                          {courts.map((court) => {
                            return (
                              <RadioGroup.Option
                                className="flex w-32 shrink-0 grow cursor-pointer flex-col rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 dark:focus:ring-color-text-darkmode-primary lg:w-auto"
                                key={court.id}
                                value={court.id}
                              >
                                {({ checked }) => (
                                  <div
                                    className={classNames(
                                      'flex grow flex-col rounded-md border-2',
                                      checked
                                        ? 'border-color-button-brand-primary'
                                        : 'border-transparent',
                                    )}
                                  >
                                    <img
                                      className="object-fit block h-16 w-full rounded-t lg:h-24"
                                      src={court?.images?.[0]?.url || DEFAULT_VENUE_IMAGE}
                                      loading="lazy"
                                    />
                                    <div
                                      className={classNames(
                                        'flex grow items-center justify-center rounded-b px-1 py-1.5 text-center text-xs font-medium lg:py-2',
                                        checked
                                          ? 'bg-color-button-brand-primary text-brand-gray-25 dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert'
                                          : 'bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary',
                                      )}
                                    >
                                      <h2>{court.title || ''}</h2>
                                    </div>
                                  </div>
                                )}
                              </RadioGroup.Option>
                            );
                          })}
                        </RadioGroup>
                        {/* <div className="w-full lg:max-w-[520px]">
                            <div className="w-full">
                              <select
                                id="play-session-court"
                                name="play-session-court"
                                value={courtId}
                                onChange={(e) => {
                                  setCourtId(e.target.value);
                                }}
                                placeholder="Select"
                                disabled={
                                  isDisabled ||
                                  !data?.usersByPk?.customCourts?.length ||
                                  !isNewPlaySession
                                }
                                className="input-form"
                                onFocus={fixIosValidationScrollBug}
                                required
                              >
                                <option value="">Select</option>
                                {!!data?.usersByPk?.customCourts?.length &&
                                  data.usersByPk.customCourts.map((court) => {
                                    return (
                                      <option key={court.id} value={court.id}>
                                        {court.title}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="mt-2 w-full">
                              <button
                                type="button"
                                onClick={() => setIsCourtModalOpen(true)}
                                className="input-form w-full text-right"
                                disabled={isDisabled || !isNewPlaySession}
                              >
                                <span className="font-bold text-color-brand-highlight">
                                  + Add new court
                                </span>
                              </button>
                            </div>
                          </div> */}
                      </FormSection>
                    </div>
                  )}
                  {isNewPlaySession && (
                    <FormSection className="px-6 lg:px-0">
                      <div className="flex space-x-3">
                        <label
                          htmlFor="play-session-plan"
                          className="label-form lg:mb-0 lg:text-xl lg:font-semibold"
                        >
                          Leave a comment
                        </label>
                        <div className="pt-[5px] text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:text-sm">
                          Optional
                        </div>
                      </div>
                      <div className="w-full lg:max-w-[520px]">
                        <textarea
                          id="play-session-plan"
                          name="play-session-plan"
                          placeholder="Tell the players what they can expect"
                          className="input-form"
                          rows={3}
                          value={description}
                          disabled={isDisabled}
                          onChange={(e) => setDescription(e.target.value)}
                          style={{ resize: 'none' }}
                          onFocus={fixIosValidationScrollBug}
                        />
                      </div>
                    </FormSection>
                  )}
                  <div className="w-full px-6 lg:px-0">
                    {isNewPlaySession ? (
                      <div className="mt-8 lg:flex lg:justify-end">
                        <button
                          type="submit"
                          form={NEW_PLAY_SESSION_FORM_ID}
                          className="button-rounded-full-primary lg:button-rounded-inline-primary lg:w-auto lg:px-8"
                          disabled={isDisabled}
                        >
                          Continue to preview
                        </button>
                      </div>
                    ) : (
                      <div className="mt-20 flex items-center space-x-4 lg:mt-12 lg:flex lg:justify-end">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          disabled={isDisabled}
                          className="button-rounded-full-primary-inverted lg:button-rounded-inline-primary-inverted w-1/2 lg:w-auto lg:px-8"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          form={NEW_PLAY_SESSION_FORM_ID}
                          className="button-rounded-full-primary lg:button-rounded-inline-primary w-1/2 lg:w-auto lg:px-8"
                          disabled={isDisabled}
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </SafeAreaPage>
      {/* <ModalNewCourt
        isOpen={isCourtModalOpen}
        handleClose={() => setIsCourtModalOpen(false)}
        refetchLessonContent={refetchCustomCourts}
        setCourtId={setCourtId}
      /> */}
    </>
  );
}
