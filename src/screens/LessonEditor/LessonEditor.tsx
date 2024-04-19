import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { addMinutes, differenceInMinutes, format, set } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { IS_ZERO_DOLLAR_PAYMENTS_ALLOWED } from 'constants/flags';
import { NEW_LESSON_PAGE, getNewLessonPreviewPageUrl } from 'constants/pages';
import { paymentFulfillChannelsCoach } from 'constants/payments';
import {
  ImageWideForLessonType,
  defaultNameForLessonType,
  defaultParticipantLimitByClassType,
  equipmentOrder,
  lessonDisplayName,
} from 'constants/sports';
import {
  LessonEquipmentOptionsEnum,
  LessonPrivacyEnum,
  LessonStatusesEnum,
  LessonTypesEnum,
  PaymentFulfillmentChannelsEnum,
  SportsEnum,
  useGetLessonByIdLazyQuery,
  useGetUserAvailableLessonContentLazyQuery,
  useInsertNewLessonWithExistingCourtMutation,
  useUpdateExistingLessonByIdMutation,
  useUpdateLessonEquipmentMutation,
  useUpdateLessonTimesMutation,
  useUpdateNewLessonByIdMutation,
  useUpdateUserDefaultCoachPaymentFulfillmentChannelMutation,
  useUpdateUserDefaultSportMutation,
} from 'types/generated/client';
import { fixIosValidationScrollBug } from 'utils/mobile/fixIosValidationScrollBug';
import { convertFormattedPriceToUnitAmount } from 'utils/shared/money/convertFormattedPriceToUnitAmount';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import TransitionFadeIn from 'components/TransitionFadeIn';
import ModalStripeOnboarding from 'components/modals/ModalStripeOnboarding';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import FormSection from './FormSection';
import ModalNewCourt from './ModalNewCourt';
import ModalPaymentFulfillmentChannel from './ModalPaymentFulfillmentChannel';
import PillButton from './PillButton';
import { TemplateButton } from './styles';

const NEW_LESSON_FORM_ID = 'new-lesson-form';
const DEFAULT_DURATION_MINUTES = 60;
const IS_HIDE_SIDEBAR = true;
const PUBLIC_DESCRIPTION = 'Anyone that follows you can see this lesson in their feed.';
const PRIVATE_DESCRIPTION = 'Only people who have a direct link can find this lesson.';

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];
const AM_TIME = 'AM';
const PM_TIME = 'PM';

interface Props {
  isNewLesson: boolean;
}

type Equipment = Record<LessonEquipmentOptionsEnum, boolean>;

const defaultRequiredEquipment = equipmentOrder.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.id]: curr.isDefault,
  };
}, {} as Equipment);

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

const LessonEditor: React.FC<Props> = ({ isNewLesson }) => {
  const router = useRouter();
  const viewer = useViewer();
  const { user, loading: isCurrentUserLoading, called: isCurrentUserCalled } = useGetCurrentUser();
  const [fetchExistingLesson, { data: existingLessonData, loading: isFetchingExisingLoading }] =
    useGetLessonByIdLazyQuery();
  const [
    fetchAvailableLessonContent,
    { data, loading: isFetchingAvailableLoading, refetch: refetchLessonContent },
  ] = useGetUserAvailableLessonContentLazyQuery();
  const [insertLessonExistingCourtMutation, { loading: isInsertExisingCourtLoading }] =
    useInsertNewLessonWithExistingCourtMutation();
  const [updateLessonTimesMutation, { loading: isUpdateLessonTimesLoading }] =
    useUpdateLessonTimesMutation();
  const [updateLessonEquipmentMutation, { loading: isUpdateEquipmentLoading }] =
    useUpdateLessonEquipmentMutation();
  const [updateNewLessonById, { loading: isUpdateNewLessonLoading }] =
    useUpdateNewLessonByIdMutation();
  const [updateExistingLessonById, { loading: isUpdateExistingLessonLoading }] =
    useUpdateExistingLessonByIdMutation();
  const [updateUserDefaultSportMutation] = useUpdateUserDefaultSportMutation();
  const [updateUserDefaultCoachPaymentFulfillmentChannel] =
    useUpdateUserDefaultCoachPaymentFulfillmentChannelMutation();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = React.useState(false);
  const [isCourtModalOpen, setIsCourtModalOpen] = React.useState(false);
  const [isPaymentFulfillmentModalOpen, setIsPaymentFulfillmentModalOpen] = React.useState(false);
  const [paymentFulfillmentChannel, setPaymentFulfillmentChannel] = React.useState(
    PaymentFulfillmentChannelsEnum.OnPlatform,
  );
  const [templateId, setTemplateId] = React.useState('');
  const [existingLessonId, setExistingLessonId] = React.useState('');
  const [lessonType, setLessonType] = React.useState('');
  const [lessonSport, setLessonSport] = React.useState(SportsEnum.Tennis);
  const [lessonPrivacy, setLessonPrivacy] = React.useState(LessonPrivacyEnum.Public);
  const [lessonTitle, setLessonTitle] = React.useState('');
  const [hasTouchedTitle, setHasTouchedTitle] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [startHours, setStartHours] = React.useState('');
  const [startMinutes, setStartMinutes] = React.useState('00');
  const [startAmPm, setStartAmPm] = React.useState(AM_TIME);
  const [durationMinutes, setDurationMinutes] = React.useState(DEFAULT_DURATION_MINUTES);
  const [courtId, setCourtId] = React.useState('');
  const [hasUpdatedParticipantLimit, setHasUpdatedParticipantLimit] = React.useState(false);
  const [participantLimit, setParticipantLimit] = React.useState<number | string>(
    defaultParticipantLimitByClassType[''],
  );
  const [price, setPrice] = React.useState<number | string>('');
  const [description, setDescription] = React.useState('');
  const [requiredEquipment, setRequiredEquipment] =
    React.useState<Equipment>(defaultRequiredEquipment);
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
  const fallbackImageUrl =
    ImageWideForLessonType[(lessonType as LessonTypesEnum) || LessonTypesEnum.Custom];
  const selectedFulfillmentChannel = paymentFulfillChannelsCoach[paymentFulfillmentChannel];
  const {
    Logo: FulfillmentLogo,
    name: fulfillmentName,
    description: fulfillmentDescription,
  } = selectedFulfillmentChannel;
  const isViewerLoading =
    viewer.status === AuthStatus.Loading || isCurrentUserLoading || !isCurrentUserCalled;
  const isDisabled =
    isFetchingExisingLoading ||
    isFetchingAvailableLoading ||
    isInsertExisingCourtLoading ||
    isUpdateLessonTimesLoading ||
    isUpdateEquipmentLoading ||
    isUpdateNewLessonLoading ||
    isUpdateExistingLessonLoading ||
    isViewerLoading;

  React.useEffect(() => {
    if (viewer.userId) {
      fetchAvailableLessonContent({
        variables: { id: viewer.userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      });
    }
  }, [viewer.userId]);

  React.useEffect(() => {
    if (isNewLesson) {
      if (user?.defaultSport) {
        setLessonSport(user.defaultSport);
      }
      if (user?.defaultCoachPaymentFulfillmentChannel) {
        setPaymentFulfillmentChannel(user.defaultCoachPaymentFulfillmentChannel);
      }
    }

    if (
      !!user &&
      !user.defaultCoachPaymentFulfillmentChannel &&
      !user.stripeMerchantChargesEnabled
    ) {
      setIsPayoutModalOpen(true);
    }
  }, [user, isNewLesson]);

  React.useEffect(() => {
    if (router.isReady) {
      const datetime = router.query.datetime;

      if (datetime && typeof datetime === 'string') {
        const parsedLessonDate = new Date(parseInt(datetime, 10));
        const date = format(parsedLessonDate, 'yyyy-MM-dd');
        const timeFullString = format(parsedLessonDate, 'p');
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
    const fetchLesson = async (id: string) => {
      try {
        const response = await fetchExistingLesson({
          variables: { id },
        });
        const lesson = response.data?.lessonsByPk;

        if (lesson) {
          const priceFormatted = convertUnitPriceToFormattedPrice(lesson.priceUnitAmount);
          const startDateObject = new Date(lesson.startDateTime);
          const endDateObject = new Date(lesson.endDateTime);
          const startDate = format(startDateObject, 'yyyy-MM-dd');
          const timeFullString = format(startDateObject, 'p');
          const [timeNumberString, ampm] = timeFullString.split(' ');
          const [hourString, minuteString] = timeNumberString.split(':');
          const formattedHourString = hourString[0] === '0' ? hourString[1] : hourString;
          const duration = differenceInMinutes(endDateObject, startDateObject);
          const existingEquipment = lesson.equipment.reduce((acc, curr) => {
            return {
              ...acc,
              [curr.equipmentOptionId]: true,
            };
          }, {} as Equipment);

          setLessonType(lesson.type);
          setLessonTitle(lesson.title);
          setHasTouchedTitle(true);
          setDate(startDate);
          setStartHours(formattedHourString);
          setStartMinutes(minuteString);
          setStartAmPm(ampm);
          setDurationMinutes(duration);
          setCourtId(lesson.userCustomCourtId || '');
          setParticipantLimit(
            lesson.participantLimit || defaultParticipantLimitByClassType[lesson.type] || 1,
          );
          setPaymentFulfillmentChannel(
            lesson.paymentFulfillmentChannel || PaymentFulfillmentChannelsEnum.OnPlatform,
          );
          setPrice(priceFormatted.priceFormatted);
          setDescription(lesson.description);
          setTemplateId(lesson.usedTemplateId);
          setRequiredEquipment(existingEquipment);
          setLessonSport(lesson.sport);
          setLessonPrivacy(lesson.privacy);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.userId) {
      const existingLessonId = router.query.lessonId || router.query.newLessonId;
      if (existingLessonId && typeof existingLessonId === 'string') {
        setExistingLessonId(existingLessonId);
        fetchLesson(existingLessonId);
      }
    }
  }, [router.isReady, viewer.userId]);

  return (
    <>
      <Head
        title={isNewLesson ? 'New Lesson' : 'Edit Lesson'}
        description="Create a lesson on Bounce"
      />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <form
          id={NEW_LESSON_FORM_ID}
          className="flex h-full grow flex-col"
          onSubmit={async (e) => {
            e.preventDefault();

            let lessonId = '';

            if (
              !user?.stripeMerchantChargesEnabled &&
              (paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform ||
                paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.ParticipantsChoice)
            ) {
              setIsPayoutModalOpen(true);
              return;
            }

            const lessonEquipmentData = Object.entries(requiredEquipment)
              .filter(([_key, value]) => {
                return value;
              })
              .map(([key]) => {
                return {
                  lessonId: existingLessonId || undefined,
                  equipmentOptionId: key as LessonEquipmentOptionsEnum,
                };
              });

            // NOTE: End early since you're updating a published lesson
            if (!isNewLesson && existingLessonId) {
              try {
                await Promise.all([
                  updateExistingLessonById({
                    variables: {
                      lessonId: existingLessonId,
                      title: lessonTitle,
                      description: description,
                      sport: lessonSport,
                      paymentFulfillmentChannel: paymentFulfillmentChannel,
                      participantLimit:
                        typeof participantLimit === 'number'
                          ? participantLimit
                          : parseInt(participantLimit, 10),
                    },
                  }),
                  updateLessonEquipmentMutation({
                    variables: {
                      lessonId: existingLessonId,
                      lessonEquipmentData: lessonEquipmentData,
                    },
                  }),
                ]);
                return router.back();
              } catch (error) {
                Sentry.captureException(error);
                toast.error('Error updating lesson');
                return;
              }
            }

            if (!lessonType) {
              toast.error('Please add a lesson type');
              return;
            }

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
              const priceNumber = typeof price === 'number' ? price : parseFloat(price);
              const priceUnitAmount = convertFormattedPriceToUnitAmount(priceNumber);

              if (
                (!IS_ZERO_DOLLAR_PAYMENTS_ALLOWED ||
                  paymentFulfillmentChannel !== PaymentFulfillmentChannelsEnum.OffPlatform) &&
                priceUnitAmount <= 0
              ) {
                toast.error('Please enter a price greater than $0');
                return;
              }

              const existingLesson = existingLessonData?.lessonsByPk;
              const isUpdateExistingLesson = !!existingLessonId && !!existingLesson;

              if (isUpdateExistingLesson) {
                const previousCourtId = existingLesson.userCustomCourtId;
                const lessonTimePromise = updateLessonTimesMutation({
                  variables: {
                    lessonId: existingLessonId,
                    lessonTimeData: [
                      {
                        lessonId: existingLessonId,
                        startDateTime: startDateTime.toISOString(),
                        endDateTime: endDateTime.toISOString(),
                      },
                    ],
                  },
                });
                const lessonEquipmentPromise = updateLessonEquipmentMutation({
                  variables: {
                    lessonId: existingLessonId,
                    lessonEquipmentData: lessonEquipmentData,
                  },
                });

                const [_insertTimeResponse] = await Promise.all([
                  lessonTimePromise,
                  lessonEquipmentPromise,
                ]);

                const response = await updateNewLessonById({
                  variables: {
                    lessonId: existingLessonId,
                    title: lessonTitle,
                    sport: lessonSport,
                    description: description,
                    type: lessonType as LessonTypesEnum,
                    typeCustom: '',
                    status: LessonStatusesEnum.Pending,
                    startDateTime: startDateTime.toISOString(),
                    endDateTime: endDateTime,
                    paymentFulfillmentChannel: paymentFulfillmentChannel,
                    participantLimit:
                      typeof participantLimit === 'number'
                        ? participantLimit
                        : parseInt(participantLimit, 10),
                    priceUnitAmount: priceUnitAmount,
                    privacy: lessonPrivacy,
                    coverImageUrl: '',
                    usedTemplateId: templateId || null,
                    userCustomCourtId: courtId || previousCourtId,
                  },
                });
                if (response.errors) {
                  Sentry.captureException(response.errors);
                  throw new Error('GraphQL errors');
                }
                lessonId = existingLessonId;
              } else {
                const response = await insertLessonExistingCourtMutation({
                  variables: {
                    title: lessonTitle,
                    sport: lessonSport,
                    description: description,
                    type: lessonType as LessonTypesEnum,
                    typeCustom: '',
                    status: LessonStatusesEnum.Pending,
                    startDateTime: startDateTime.toISOString(),
                    endDateTime: endDateTime,
                    ownerUserId: viewer.userId,
                    paymentFulfillmentChannel: paymentFulfillmentChannel,
                    participantLimit:
                      typeof participantLimit === 'number'
                        ? participantLimit
                        : parseInt(participantLimit, 10),
                    priceUnitAmount: priceUnitAmount,
                    privacy: lessonPrivacy,
                    coverImageUrl: '',
                    usedTemplateId: templateId || null,
                    locale: getNavigatorLanguage(),
                    timezoneName,
                    timezoneAbbreviation: timezoneAbbreviation || '',
                    timezoneOffsetMinutes,
                    lessonTimeData: [
                      {
                        startDateTime: startDateTime.toISOString(),
                        endDateTime: endDateTime.toISOString(),
                      },
                    ],
                    userCustomCourtId: courtId,
                    lessonEquipment: lessonEquipmentData,
                  },
                });
                if (response.errors) {
                  Sentry.captureException(response.errors);
                  throw new Error('GraphQL errors');
                }
                const lesson = response.data?.insertLessonsOne;
                lessonId = lesson?.id;
              }

              if (viewer.userId && lessonSport) {
                updateUserDefaultSportMutation({
                  variables: {
                    id: viewer.userId,
                    defaultSport: lessonSport,
                  },
                }).catch((error) => Sentry.captureException(error));
              }
              if (viewer.userId && paymentFulfillmentChannel) {
                updateUserDefaultCoachPaymentFulfillmentChannel({
                  variables: {
                    id: viewer.userId,
                    defaultCoachPaymentFulfillmentChannel: paymentFulfillmentChannel,
                  },
                }).catch((error) => Sentry.captureException(error));
              }

              if (lessonId) {
                const lessonPreviewUrl = getNewLessonPreviewPageUrl(lessonId);
                // NOTE: If they hit the back button, this ensures they see the previous lesson to edit
                await router.replace(`${NEW_LESSON_PAGE}?newLessonId=${lessonId}`, undefined, {
                  shallow: true,
                });
                router.push(lessonPreviewUrl);
              } else {
                toast.error(
                  'There was an issue creating your lesson. Please try again or contact support@bounce.game',
                );
              }
            } catch (error) {
              Sentry.captureException(error);
              toast.error(
                'There was an issue creating your lesson. Please try again or contact support@bounce.game',
              );
            }
          }}
        >
          <div className="relative h-full grow">
            <div className="flex h-full w-full grow flex-col items-center">
              <div className="bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
                <FixedPageTitle
                  title={isNewLesson ? 'New lesson' : 'Modify lesson'}
                  isPop
                  isBackdropBlur
                  isHideSidebar={IS_HIDE_SIDEBAR}
                  right={
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="button-rounded-inline-primary px-4 text-xs font-semibold"
                    >
                      {isNewLesson ? 'Continue' : 'Save'}
                    </button>
                  }
                />
              </div>
              <div className="flex h-full w-full grow flex-col pb-16">
                {isNewLesson && !!data?.usersByPk?.lessonTemplates.length && (
                  <div className="w-full lg:mx-auto lg:max-w-main-content-container">
                    <FormSection>
                      <div className="px-6 lg:px-0">
                        <h3 className="label-form lg:text-xl lg:font-semibold">My templates</h3>
                      </div>
                      <div className="mb-4 flex w-full flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 pb-4 lg:mb-0 lg:grid lg:max-w-[520px] lg:grid-cols-6 lg:gap-2 lg:space-x-0 lg:overflow-auto lg:px-0 lg:pb-2">
                        <TemplateButton
                          type="button"
                          className={classNames(
                            'flex h-20 w-20 flex-initial items-center justify-center rounded-md border px-1 text-xs transition-all',
                            !templateId && data?.usersByPk?.lessonTemplates.length
                              ? 'border-color-brand-primary bg-color-bg-lightmode-primary shadow-option-active dark:bg-color-bg-darkmode-primary'
                              : 'border-transparent bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
                          )}
                          onClick={() => setTemplateId('')}
                        >
                          None
                        </TemplateButton>
                        {data?.usersByPk?.lessonTemplates.map((template) => {
                          return (
                            <TemplateButton
                              key={template.id}
                              type="button"
                              className={classNames(
                                'flex h-20 w-20 flex-initial items-center justify-center rounded-md border px-1 text-xs transition-all',
                                templateId === template.id
                                  ? 'border-color-brand-primary shadow-option-active'
                                  : 'border-transparent',
                                template.type === LessonTypesEnum.Individual &&
                                  'bg-color-lesson-individual',
                                template.type === LessonTypesEnum.Cardio &&
                                  'bg-color-lesson-cardio',
                                template.type === LessonTypesEnum.Clinic &&
                                  'bg-color-lesson-clinic',
                                template.type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                                template.type === LessonTypesEnum.Custom && 'bg-color-lesson-other',
                              )}
                              onClick={() => {
                                setTemplateId(template.id);
                                setLessonType(template.type);
                                setLessonTitle(template.title);
                                setCourtId(template.userCustomCourtId || '');
                                setParticipantLimit(template.participantLimit);
                                setPrice(
                                  convertUnitPriceToFormattedPrice(template.priceUnitAmount)
                                    .priceFormatted,
                                );
                                setDescription(template.description);

                                if (template.privacy) {
                                  setLessonPrivacy(template.privacy);
                                }

                                if (template.sport) {
                                  setLessonSport(template.sport);
                                }
                              }}
                            >
                              {template.templateName}
                            </TemplateButton>
                          );
                        })}
                      </div>
                    </FormSection>
                  </div>
                )}
                <div className="px-6">
                  <div className="space-y-8 lg:mx-auto lg:max-w-main-content-container lg:space-y-0">
                    <FormSection>
                      <label
                        htmlFor="lesson-sport"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Sport
                      </label>
                      <div className="min-h-[40px] w-full lg:max-w-[520px]">
                        <TransitionFadeIn isShowing={!isViewerLoading}>
                          <div className="flex items-center space-x-6">
                            <button
                              type="button"
                              onClick={() => setLessonSport(SportsEnum.Tennis)}
                              className={classNames(
                                'h-10 w-1/2 rounded-md border transition-shadow lg:w-[120px]',
                                lessonSport === SportsEnum.Tennis
                                  ? 'border-color-tab-active bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
                                  : 'border-color-border-card-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-tertiary shadow-none dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-secondary',
                              )}
                            >
                              Tennis
                            </button>
                            <button
                              type="button"
                              onClick={() => setLessonSport(SportsEnum.Pickleball)}
                              className={classNames(
                                'h-10 w-1/2 rounded-md border transition-shadow lg:w-[120px]',
                                lessonSport === SportsEnum.Pickleball
                                  ? 'border-color-tab-active bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
                                  : 'border-color-border-card-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-tertiary shadow-none dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-secondary',
                              )}
                            >
                              Pickleball
                            </button>
                          </div>
                        </TransitionFadeIn>
                      </div>
                    </FormSection>
                    <FormSection>
                      <label
                        htmlFor="lesson-type"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Type of lesson
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <select
                          id="lesson-type"
                          name="lesson-type"
                          value={lessonType}
                          onChange={(e) => {
                            const newLessonType = e.target.value as LessonTypesEnum;
                            setLessonType(newLessonType);

                            if (!hasUpdatedParticipantLimit) {
                              setParticipantLimit(
                                defaultParticipantLimitByClassType[newLessonType],
                              );
                            }
                            if (!hasTouchedTitle) {
                              setLessonTitle(defaultNameForLessonType[newLessonType]);
                            }
                            if (lessonTitle === '') {
                              setLessonTitle(defaultNameForLessonType[newLessonType]);
                              setHasTouchedTitle(false);
                            }
                          }}
                          placeholder="Not chosen"
                          disabled={isDisabled || !isNewLesson}
                          className="input-form"
                          onFocus={fixIosValidationScrollBug}
                          required
                        >
                          <option value="" disabled>
                            Not chosen
                          </option>
                          <option value={LessonTypesEnum.Individual}>
                            {lessonDisplayName[LessonTypesEnum.Individual]}
                          </option>
                          <option value={LessonTypesEnum.Clinic}>
                            {lessonDisplayName[LessonTypesEnum.Clinic]}
                          </option>
                          <option value={LessonTypesEnum.Cardio}>
                            {lessonDisplayName[LessonTypesEnum.Cardio]}
                          </option>
                          {/* <option value={LessonTypesEnum.Camp}>Camp</option> */}
                          <option value={LessonTypesEnum.Custom}>
                            {lessonDisplayName[LessonTypesEnum.Custom]}
                          </option>
                        </select>
                      </div>
                    </FormSection>
                    <FormSection>
                      <label
                        htmlFor="lesson-title"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Lesson name
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <input
                          id="lesson-title"
                          name="lesson-title"
                          type="text"
                          placeholder="Quick identifiable name"
                          className="input-form"
                          value={lessonTitle}
                          disabled={isDisabled}
                          onChange={(e) => {
                            setHasTouchedTitle(true);
                            setLessonTitle(e.target.value);
                          }}
                          onFocus={fixIosValidationScrollBug}
                          required
                        />
                      </div>
                    </FormSection>
                    <FormSection>
                      <label
                        htmlFor="lesson-privacy"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Who can join
                      </label>
                      <div className="min-h-[3.5rem] w-full lg:max-w-[520px]">
                        <div className="flex items-center space-x-6">
                          <button
                            type="button"
                            onClick={() => setLessonPrivacy(LessonPrivacyEnum.Public)}
                            className={classNames(
                              'h-10 w-1/2 rounded-md border transition-shadow lg:w-[120px]',
                              lessonPrivacy === LessonPrivacyEnum.Public
                                ? 'border-color-tab-active bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
                                : 'border-color-border-card-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-tertiary shadow-none dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-secondary',
                            )}
                          >
                            Public
                          </button>
                          <button
                            type="button"
                            onClick={() => setLessonPrivacy(LessonPrivacyEnum.Private)}
                            className={classNames(
                              'h-10 w-1/2 rounded-md border transition-shadow lg:w-[120px]',
                              lessonPrivacy === LessonPrivacyEnum.Private
                                ? 'border-color-tab-active bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
                                : 'border-color-border-card-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-tertiary shadow-none dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-secondary',
                            )}
                          >
                            Private
                          </button>
                        </div>
                        <div className="mt-4 text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary md:text-sm">
                          {lessonPrivacy === LessonPrivacyEnum.Public
                            ? PUBLIC_DESCRIPTION
                            : PRIVATE_DESCRIPTION}
                        </div>
                      </div>
                    </FormSection>
                    {isNewLesson && (
                      <FormSection>
                        <label
                          htmlFor="lesson-date"
                          className="label-form lg:text-xl lg:font-semibold"
                        >
                          Date
                        </label>
                        <div className="w-full lg:max-w-[520px]">
                          <input
                            id="lesson-date"
                            name="lesson-date"
                            type="date"
                            placeholder="Choose a date"
                            className={classNames(
                              'input-form focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                              isDateSolid
                                ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                                : 'dark:color-text-darkmode-placeholder text-color-text-lightmode-placeholder',
                            )}
                            value={date}
                            disabled={isDisabled || !isNewLesson}
                            onChange={(e) => setDate(e.target.value)}
                            onFocus={fixIosValidationScrollBug}
                            required
                          />
                        </div>
                      </FormSection>
                    )}
                    {isNewLesson && (
                      <FormSection>
                        <label className="label-form lg:text-xl lg:font-semibold">Start time</label>
                        <div className="w-full lg:max-w-[520px]">
                          <div className="flex items-center space-x-2">
                            <div className="w-1/3">
                              <select
                                id="lesson-start-hour"
                                name="lesson-start-hour"
                                value={startHours}
                                onChange={(e) => {
                                  setStartHours(e.target.value);
                                }}
                                placeholder="Hour"
                                disabled={isDisabled || !isNewLesson}
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
                                id="lesson-start-minute"
                                name="lesson-start-minute"
                                value={startMinutes}
                                onChange={(e) => {
                                  setStartMinutes(e.target.value);
                                }}
                                placeholder="Min"
                                disabled={isDisabled || !isNewLesson}
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
                                id="lesson-start-ampm"
                                name="lesson-start-ampm"
                                value={startAmPm}
                                onChange={(e) => {
                                  setStartAmPm(e.target.value);
                                }}
                                placeholder="AM PM"
                                disabled={isDisabled || !isNewLesson}
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
                    )}
                    {isNewLesson && (
                      <FormSection>
                        <label
                          htmlFor="lesson-duration"
                          className="label-form lg:text-xl lg:font-semibold"
                        >
                          Duration
                        </label>
                        <div className="w-full lg:max-w-[520px]">
                          <select
                            id="lesson-duration"
                            name="lesson-duration"
                            value={durationMinutes}
                            onChange={(e) => {
                              setDurationMinutes(parseInt(e.target.value, 10));
                            }}
                            placeholder="Not chosen"
                            disabled={isDisabled || !isNewLesson}
                            className="input-form"
                            onFocus={fixIosValidationScrollBug}
                            required
                          >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1 hr 30 min</option>
                            <option value={120}>2 hours</option>
                          </select>
                        </div>
                      </FormSection>
                    )}
                    {isNewLesson && (
                      <div>
                        <FormSection>
                          <label
                            htmlFor="lesson-court"
                            className="label-form lg:text-xl lg:font-semibold"
                          >
                            Court
                          </label>
                          <div className="w-full lg:max-w-[520px]">
                            <div className="w-full">
                              <select
                                id="lesson-court"
                                name="lesson-court"
                                value={courtId}
                                onChange={(e) => {
                                  setCourtId(e.target.value);
                                }}
                                placeholder="Select"
                                disabled={
                                  isDisabled ||
                                  !data?.usersByPk?.customCourts?.length ||
                                  !isNewLesson
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
                                disabled={isDisabled || !isNewLesson}
                              >
                                <span className="font-bold text-color-brand-highlight">
                                  + Add new court
                                </span>
                              </button>
                            </div>
                          </div>
                        </FormSection>
                      </div>
                    )}
                    <FormSection>
                      <label
                        htmlFor="lesson-participant-limit"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Participant limit
                      </label>
                      <div className="flex w-full items-center space-x-3 lg:max-w-[520px]">
                        <button
                          type="button"
                          className="input-form flex w-1/5 items-center justify-center text-lg font-semibold"
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
                          id="lesson-participant-limit"
                          name="lesson-participant-limit"
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
                          className="input-form flex w-1/5 items-center justify-center text-lg"
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
                    </FormSection>
                    {isNewLesson && (
                      <FormSection>
                        <label
                          htmlFor="lesson-price"
                          className="label-form lg:text-xl lg:font-semibold"
                        >
                          Price
                        </label>
                        <div className="relative flex w-full items-center lg:max-w-[520px]">
                          <input
                            id="lesson-price"
                            name="lesson-price"
                            type="number"
                            onWheel={(e) => {
                              // NOTE: Prevent wheel scroll from changing number
                              e.preventDefault();
                              e.currentTarget.blur();
                              return false;
                            }}
                            step=".01"
                            min={
                              IS_ZERO_DOLLAR_PAYMENTS_ALLOWED &&
                              paymentFulfillmentChannel ===
                                PaymentFulfillmentChannelsEnum.OffPlatform
                                ? '0'
                                : '1'
                            }
                            placeholder="Cost per player"
                            className="input-base-form px-8"
                            value={price}
                            disabled={isDisabled || !isNewLesson}
                            onChange={(e) => {
                              if (e.target.value === '') {
                                setPrice(e.target.value);
                                return;
                              }

                              const value = Math.max(
                                0,
                                parseFloat(parseFloat(e.target.value).toFixed(2)),
                              );

                              if (value >= 0) {
                                setPrice(value);
                              }
                            }}
                            onFocus={fixIosValidationScrollBug}
                            required
                          />
                          <div className="dark:color-text-darkmode-placeholder absolute left-3.5 text-color-text-lightmode-placeholder">
                            $
                          </div>
                        </div>
                      </FormSection>
                    )}
                    <FormSection>
                      <label
                        htmlFor="lesson-payment-method"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Payment method
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <div className="w-full">
                          <div className="w-full rounded-md border border-color-border-input-lightmode p-4 dark:border-color-border-input-darkmode">
                            <div className="text-base leading-none">
                              {fulfillmentName ? (
                                fulfillmentName
                              ) : FulfillmentLogo ? (
                                <FulfillmentLogo />
                              ) : null}
                            </div>
                            <div className="mt-2 text-xs leading-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                              {fulfillmentDescription}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setIsPaymentFulfillmentModalOpen(true)}
                            className="w-full text-right"
                            disabled={isDisabled}
                          >
                            <span className="font-bold text-color-brand-highlight">
                              See alternative options
                            </span>
                          </button>
                        </div>
                      </div>
                    </FormSection>
                    <FormSection>
                      <label
                        htmlFor="lesson-plan"
                        className="label-form lg:text-xl lg:font-semibold"
                      >
                        Lesson plan or description
                      </label>
                      <div className="w-full lg:max-w-[520px]">
                        <textarea
                          id="lesson-plan"
                          name="lesson-plan"
                          placeholder="Tell the players what they can expect"
                          className="input-form"
                          rows={3}
                          value={description}
                          disabled={isDisabled}
                          onChange={(e) => setDescription(e.target.value)}
                          style={{ resize: 'none' }}
                          onFocus={fixIosValidationScrollBug}
                          required
                        />
                      </div>
                    </FormSection>
                    <FormSection>
                      <label className="label-base lg:text-xl lg:font-semibold">
                        Equipment requirements
                      </label>
                      <div className="flex w-full flex-wrap items-center lg:max-w-[520px]">
                        {equipmentOrder.map((equipment) => {
                          return (
                            <PillButton
                              key={equipment.id}
                              Icon={equipment.Icon}
                              name={equipment.name}
                              isBadgeActive={requiredEquipment[equipment.id]}
                              handleClick={() =>
                                setRequiredEquipment({
                                  ...requiredEquipment,
                                  [equipment.id]: !requiredEquipment[equipment.id],
                                })
                              }
                            />
                          );
                        })}
                      </div>
                    </FormSection>
                    <div className="w-full">
                      {isNewLesson ? (
                        <div className="mt-8 lg:flex lg:justify-end">
                          <button
                            type="submit"
                            form={NEW_LESSON_FORM_ID}
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
                            className="button-rounded-full-primary-inverted lg:button-rounded-inline-brand-inverted w-1/2 lg:w-auto lg:px-8"
                          >
                            Discard
                          </button>
                          <button
                            type="submit"
                            form={NEW_LESSON_FORM_ID}
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
          </div>
        </form>
      </SafeAreaPage>
      <ModalNewCourt
        isOpen={isCourtModalOpen}
        handleClose={() => setIsCourtModalOpen(false)}
        refetchLessonContent={refetchLessonContent}
        setCourtId={setCourtId}
      />
      <ModalPaymentFulfillmentChannel
        isOpen={isPaymentFulfillmentModalOpen}
        handleClose={() => setIsPaymentFulfillmentModalOpen(false)}
        paymentFulfillmentChannel={paymentFulfillmentChannel}
        setPaymentFulfillmentChannel={setPaymentFulfillmentChannel}
      />
      <ModalStripeOnboarding
        isOpen={isPayoutModalOpen}
        handleClose={(didAddBankInformation) => {
          setIsPayoutModalOpen(false);
          if (viewer.userId) {
            if (didAddBankInformation) {
              updateUserDefaultCoachPaymentFulfillmentChannel({
                variables: {
                  id: viewer.userId,
                  defaultCoachPaymentFulfillmentChannel: PaymentFulfillmentChannelsEnum.OnPlatform,
                },
              }).catch((error) => Sentry.captureException(error));
              setPaymentFulfillmentChannel(PaymentFulfillmentChannelsEnum.OnPlatform);
            } else {
              updateUserDefaultCoachPaymentFulfillmentChannel({
                variables: {
                  id: viewer.userId,
                  defaultCoachPaymentFulfillmentChannel: PaymentFulfillmentChannelsEnum.OffPlatform,
                },
              }).catch((error) => Sentry.captureException(error));
              setPaymentFulfillmentChannel(PaymentFulfillmentChannelsEnum.OffPlatform);
            }
          }
        }}
      />
    </>
  );
};

export default LessonEditor;
