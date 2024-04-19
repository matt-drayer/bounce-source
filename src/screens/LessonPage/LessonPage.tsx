import * as React from 'react';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import * as Sentry from '@sentry/nextjs';
import { differenceInMinutes } from 'date-fns';
import { format, isPast } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import {
  getExistingLessonEditPageUrl,
  getLessonJoinPageUrl,
  getLessonPaymentFulfillmentChannelPageUrl,
  getLessonPublishedPageUrl,
  getNewLessonEditPageUrl,
  getProfilePageUrl,
} from 'constants/pages';
import { paymentFulfillChannelsDisplay } from 'constants/payments';
import { lessonShortName } from 'constants/sports';
import { ImageWideForLessonType, equipmentOrder } from 'constants/sports';
import { EMPTY_AVATAR_SRC } from 'constants/user';
import {
  FollowStatusesEnum,
  LessonParticipantStatusesEnum,
  LessonStatusesEnum,
  LessonTypesEnum,
  LessonWaitlistStatusesEnum,
  PaymentFulfillmentChannelsEnum,
  SportsEnum,
  useGetLessonByIdLazyQuery,
  useGetLessonParticipantOrderDetailsLazyQuery,
  useGetLessonWaitlistLazyQuery,
  useInsertLessonTemplateMutation,
  useSetLessonAsActiveMutation,
  useUpsertFollowerConnectionMutation,
  useUpsertLessonWaitlistMutation,
} from 'types/generated/client';
import { delayedAction } from 'utils/client/delayedAction';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getIsPlayerCancelRefundable } from 'utils/shared/user/getIsPlayerCancelRefundable';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import Calendar from 'svg/Calendar';
import Clock from 'svg/Clock';
import CoachBadge from 'svg/CoachBadge';
import InfoCircle from 'svg/InfoCircle';
import Location from 'svg/Location';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Link from 'components/Link';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import ParticipantAvatar from 'components/ParticipantAvatar';
import { EXIT_DURATION_SAFE_MS } from 'components/modals/Modal/Modal';
import ModalSignup from 'components/modals/ModalSignup';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import ModalCoachCancelComplete from './ModalCoachCancelComplete';
import ModalCoachCancelPrompt from './ModalCoachCancelPrompt';
import ModalPlayerCancelComplete from './ModalPlayerCancelComplete';
import ModalPlayerCancelPrompt from './ModalPlayerCancelPrompt';
import ModalWaitlist from './ModalWaitlist';
import SectionHeading from './SectionHeading';
import ShareButton from './ShareButton';
import { Props } from './props';

const FORM_ID = 'publish-form';
const IS_HIDE_SIDEBAR = true;

const ON_PLATFORM_CANCEL_POLICY =
  'If you decide to cancel, you will be refunded as long the cancellation is more than 24 hours in advance. Should the coach cancel at any time, you will be fully refunded.';
const OFF_PLATFORM_CANCEL_POLICY = 'Cancellations must be handled between you and the coach.';
const COACH_CANCEL_POLICY =
  'If you decide to cancel, the player will be refunded in-full. If a player cancels, they must do so at least 24 hours before the lesson to get refunded. If they cancel at the last-minute, you will receive the payment for the lesson anyway. If the payment is through Bounce, we handle all of this for you. If the player pays you directly, you must coordinate the refund with them.';

const LessonPage: React.FC<Props> = ({ isNewLesson, injectedLessonId }) => {
  const router = useRouter();
  const viewer = useViewer();
  const lessonId = router?.query?.lessonId || injectedLessonId || '';
  const [isModalSignupOpen, setIsModalSignupOpen] = React.useState(false);
  const [isTemplateChecked, setIsTemplateChecked] = React.useState(false);
  const [isCoachCancelPromptModalOpen, setIsCoachCancelPromptModalOpen] = React.useState(false);
  const [isCoachCancelCompleteModalOpen, setIsCoachCancelCompleteModalOpen] = React.useState(false);
  const [isPlayerCancelPromptModalOpen, setIsPlayerCancelPromptModalOpen] = React.useState(false);
  const [isPlayerCancelCompleteModalOpen, setIsPlayerCancelCompleteModalOpen] =
    React.useState(false);
  const {
    isOpen: isWaitlistModalOpen,
    openModal: openWaitlistModal,
    closeModal: closeWaitlistModal,
  } = useModal();
  const [isCancelPolicyVisible, setIsCancelPolicyVisible] = React.useState(false);
  const [getLessonByIdLazyQuery, { data, loading, called }] = useGetLessonByIdLazyQuery();
  const [
    getLessonWaitlistLazyQuery,
    { data: waitlistData, loading: waitlistLoading, called: waitlistCalled },
  ] = useGetLessonWaitlistLazyQuery();
  const [
    getLessonParticipantOrderDetailsLazyQuery,
    {
      data: participantOrderDetailsData,
      loading: participantOrderDetailsLoading,
      called: participantOrderDetailsCalled,
    },
  ] = useGetLessonParticipantOrderDetailsLazyQuery();
  const [setLessonAsActiveMutation, { loading: publishLoading }] = useSetLessonAsActiveMutation();
  const [insertLessonTemplateMutation, { loading: templateLoading }] =
    useInsertLessonTemplateMutation();
  const [upsertFollowerMutation] = useUpsertFollowerConnectionMutation();
  const [templateName, setTemplateName] = React.useState('');
  const lesson = data?.lessonsByPk;
  const isCoach = lesson?.ownerUserId === viewer.userId;
  const isParticipant = lesson?.participants.find((p) => p.userProfile?.id === viewer.userId);
  const isOnWaitlist = !!waitlistData?.lessonWaitlists.find(
    (p) => p.userId === viewer.userId && p.status === LessonWaitlistStatusesEnum.Active,
  );
  const participantLimit = lesson?.participantLimit || 0;
  const participantCount = lesson?.participants.length || 0;
  const emptyParticipantSlots = new Array(participantLimit - participantCount).fill(null);
  const startDateTime = lesson?.startDateTime;
  const lessonDate = !!startDateTime && format(new Date(startDateTime), 'eeee MMM. d');
  const lessonStartTime = !!startDateTime && format(new Date(startDateTime), 'p');
  const lessonEndTime = !!lesson?.endDateTime && format(new Date(lesson.endDateTime), 'p');
  const isPlayerCancelRefundable = startDateTime
    ? getIsPlayerCancelRefundable({
        lessonStartDateTime: new Date(startDateTime),
      })
    : false;
  const startTimeDifferenceMinutes = startDateTime
    ? differenceInMinutes(new Date(startDateTime), new Date())
    : 0;
  const isDisabled = loading || !called || templateLoading || publishLoading;
  const coverImageUrl = lesson?.coverImagePath;
  const fallbackImageUrl = ImageWideForLessonType[lesson?.type || LessonTypesEnum.Custom];
  const paymentFulfillChannel = lesson?.paymentFulfillmentChannel
    ? paymentFulfillChannelsDisplay[lesson.paymentFulfillmentChannel]
    : { name: '', description: '' };
  const {
    Logo: FulfillmentLogo,
    name: fulfillmentName,
    description: fulfillmentDescription,
  } = paymentFulfillChannel;

  // NOTE: A 1-1 relationship is not enforced at the database level to preserve flexibility (see design notes),
  // but we are current assuming one participant maps to one order item which maps to a single order. (2022/09/21)
  const participant = participantOrderDetailsData?.lessonParticipants[0];
  const refundPrice = participant?.orderItems[0]?.order.paidUnitAmount;
  const refundFormattedPrice = !!refundPrice && convertUnitPriceToFormattedPrice(refundPrice);
  const displayRefundPrice = !!refundFormattedPrice ? refundFormattedPrice.priceDisplay : '';
  //
  let topButtonGroup;
  let bottomButtonGroup;

  if (isNewLesson) {
    topButtonGroup = (
      <button
        className="button-rounded-inline-primary px-4 text-xs font-semibold"
        type="submit"
        disabled={isDisabled}
      >
        Publish
      </button>
    );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        {isDisabled ? (
          <span className="button-rounded-full-primary-inverted block w-1/2 text-center lg:w-auto lg:px-10">
            Edit
          </span>
        ) : (
          <Link
            href={getNewLessonEditPageUrl(lessonId as string)}
            className="button-rounded-full-primary-inverted block w-1/2 text-center lg:w-auto lg:px-10"
          >
            Edit
          </Link>
        )}
        <button
          type="submit"
          form={FORM_ID}
          disabled={isDisabled}
          className="button-rounded-full-primary w-1/2 lg:w-auto lg:px-10"
        >
          Publish
        </button>
      </div>
    );
  } else if (!lesson || viewer.status === AuthStatus.Loading) {
    topButtonGroup = null;
    bottomButtonGroup = null;
  } else if (isPast(new Date(lesson.startDateTime))) {
    topButtonGroup = <ShareButton />;
    bottomButtonGroup = null;
  } else if (viewer.status === AuthStatus.Anonymous) {
    topButtonGroup = (
      <button
        onClick={() => setIsModalSignupOpen(true)}
        className="button-rounded-inline-primary px-4 text-xs font-semibold"
      >
        Join
      </button>
    );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <button
          onClick={() => setIsModalSignupOpen(true)}
          className="button-rounded-full-primary lg:w-auto lg:px-10"
        >
          Join
        </button>
      </div>
    );
  } else if (participant && participant.status === LessonParticipantStatusesEnum.Inactive) {
    topButtonGroup = <ShareButton />;
    bottomButtonGroup = null; // TODO: Show they can't rejoin
  } else if (lesson.status === LessonStatusesEnum.Canceled) {
    topButtonGroup = null;
    bottomButtonGroup = null; // TODO: Show canceled message
  } else if (lesson.status === LessonStatusesEnum.Pending) {
    topButtonGroup = null;
    bottomButtonGroup = null; // TODO: Show not published message
  } else if (isCoach) {
    topButtonGroup = <ShareButton />;
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <button
          type="button"
          form={FORM_ID}
          disabled={isDisabled}
          className="button-rounded-full-primary-inverted  w-1/2 lg:w-auto lg:px-10"
          onClick={() => setIsCoachCancelPromptModalOpen(true)}
        >
          Cancel <span className="hidden lg:inline">Lesson</span>
        </button>
        {isDisabled ? (
          <span className="button-rounded-full-primary  block w-1/2 text-center lg:w-auto lg:px-10">
            Modify <span className="hidden lg:inline">Lesson</span>
          </span>
        ) : (
          <Link
            href={getExistingLessonEditPageUrl(lessonId as string)}
            className="button-rounded-full-primary block w-1/2 text-center lg:w-auto lg:px-10"
          >
            Modify<span className="hidden lg:inline">Lesson</span>
          </Link>
        )}
      </div>
    );
  } else if (isParticipant) {
    topButtonGroup = <ShareButton />;
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <button
          onClick={() => setIsPlayerCancelPromptModalOpen(true)}
          type="button"
          className="button-rounded-full-primary block text-center lg:w-auto lg:px-10"
        >
          Leave lesson
        </button>
      </div>
    );
  } else if ((lesson?.participants.length || -1) >= (lesson?.participantLimit || 0)) {
    topButtonGroup = (
      <button
        onClick={() => openWaitlistModal()}
        className="button-rounded-inline-primary px-4 text-xs font-semibold"
        type="button"
      >
        {isOnWaitlist ? 'Leave Waitlist' : 'Join Waitlist'}
      </button>
    );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <button
          onClick={() => openWaitlistModal()}
          className="button-rounded-full-primary lg:w-auto lg:px-10"
          type="button"
        >
          {isOnWaitlist ? 'Leave Waitlist' : 'Join Waitlist'}
        </button>
      </div>
    );
  } else {
    const url =
      !lesson.paymentFulfillmentChannel ||
      lesson.paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform
        ? getLessonJoinPageUrl(lessonId as string)
        : getLessonPaymentFulfillmentChannelPageUrl(lessonId as string);
    topButtonGroup = (
      <Link href={url} className="button-rounded-inline-primary px-4 text-xs font-semibold">
        Join{' '}
        {!!lesson?.priceUnitAmount &&
          convertUnitPriceToFormattedPrice(lesson.priceUnitAmount).priceDisplay}
      </Link>
    );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <Link href={url} className="button-rounded-full-primary lg:w-auto lg:px-10">
          Join{' '}
          {!!lesson?.priceUnitAmount &&
            convertUnitPriceToFormattedPrice(lesson.priceUnitAmount).priceDisplay}
        </Link>
      </div>
    );
  }

  React.useEffect(() => {
    const fetchLesson = async (lessonId: string, userId?: string | null) => {
      getLessonByIdLazyQuery({
        variables: { id: lessonId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      }).catch((error) => Sentry.captureException(error));
      getLessonWaitlistLazyQuery({
        variables: { lessonId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      }).catch((error) => Sentry.captureException(error));

      if (userId) {
        getLessonParticipantOrderDetailsLazyQuery({
          variables: { userId: userId, lessonId: lessonId },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
        }).catch((error) => Sentry.captureException(error));
      }
    };

    if (router.isReady && viewer.status !== AuthStatus.Loading) {
      if (router.query.lessonId && typeof router.query.lessonId === 'string') {
        fetchLesson(router.query.lessonId, viewer.userId);
      }
    }
  }, [router.isReady, viewer.status, lessonId]);

  const handleSignupSuccess = async ({ userId }: { userId: string }) => {
    const coachProfileId = lesson?.ownerProfile?.id;

    if (userId && coachProfileId) {
      const variables = {
        followerUserId: userId,
        followedUserId: coachProfileId,
        status: FollowStatusesEnum.Active,
      };
      await upsertFollowerMutation({
        variables: variables,
        optimisticResponse: {
          __typename: 'mutation_root',
          insertUserFollowsOne: {
            __typename: 'UserFollows',
            ...variables,
          },
        },
      });
    }
  };

  return (
    <>
      <Head
        title="Lesson on Bounce"
        description="Your Bounce lesson"
        ogImage={`${process.env.APP_URL}/api/v1/lessons/${lessonId}/images/og`}
      />
      <SafeAreaPage handleSignupSuccess={handleSignupSuccess} isHideSidebar={IS_HIDE_SIDEBAR}>
        <form
          id={FORM_ID}
          className="flex h-full grow flex-col"
          onSubmit={async (e) => {
            e.preventDefault();

            if (!isNewLesson) {
              return;
            }

            try {
              if (isTemplateChecked && templateName && lesson) {
                const response = await insertLessonTemplateMutation({
                  variables: {
                    coverImageUrl: '',
                    currency: lesson.currency || '',
                    description: lesson.description || '',
                    originalLessonId: lesson.id,
                    participantLimit: lesson.participantLimit || 1,
                    priceUnitAmount: lesson.priceUnitAmount,
                    privacy: lesson.privacy,
                    templateName: templateName,
                    title: lesson.title,
                    sport: lesson.sport,
                    type: lesson.type,
                    typeCustom: lesson.typeCustom || '',
                    userCustomCourtId: lesson.userCustomCourtId,
                    userId: viewer.userId,
                  },
                });

                if (response.errors) {
                  Sentry.captureException(response.errors);
                }
              }
            } catch (error) {
              Sentry.captureException(error);
            }

            try {
              if (lesson) {
                const response = await setLessonAsActiveMutation({
                  variables: {
                    id: lesson.id,
                  },
                });

                if (response.errors) {
                  Sentry.captureException(response.errors);
                  toast.error('Error publishing lesson');
                } else {
                  router.push(getLessonPublishedPageUrl(lessonId as string));
                }
              } else {
                throw new Error('Lesson not found');
              }
            } catch (error) {
              Sentry.captureException(error);
            }
          }}
        >
          <div className="relative h-full grow">
            <div className="flex h-full w-full grow flex-col">
              <FixedPageTitle
                title={isNewLesson ? 'Overview' : 'Lesson'}
                isPop
                right={topButtonGroup}
                isBackdropBlur
                isHideSidebar={IS_HIDE_SIDEBAR}
              />
              <div className="flex h-full w-full grow flex-col items-center px-6 pb-6">
                <div className="flex h-full w-full grow flex-col lg:max-w-4xl lg:pb-20">
                  {isNewLesson && (
                    <div className="mb-5 flex flex-col rounded-md bg-color-brand-active px-4 py-6 lg:flex-row">
                      <div className="relative flex items-start lg:w-1/2 lg:pr-24">
                        <div className="flex h-5 items-center">
                          <input
                            id="save-as-template"
                            name="save-as-template"
                            type="checkbox"
                            className="checkbox-base"
                            checked={isTemplateChecked}
                            disabled={isDisabled}
                            onChange={() => setIsTemplateChecked(!isTemplateChecked)}
                          />
                        </div>
                        <div className="ml-4">
                          <label
                            htmlFor="save-as-template"
                            className="leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                          >
                            Save lesson as template
                          </label>
                          <div className="mt-2.5 flex items-center justify-between text-xs leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                            <div>Save your lesson as a template to use it again in the future.</div>
                          </div>
                        </div>
                      </div>
                      {isTemplateChecked && (
                        <div className="mt-4 lg:mt-0 lg:w-1/2">
                          <label
                            htmlFor="template-title"
                            className="mb-2 block text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                          >
                            Template title
                          </label>
                          <input
                            id="template-title"
                            className="input-inverted"
                            placeholder="Ex. Beginner clinic 3.0 - 3.5"
                            value={templateName}
                            disabled={isDisabled}
                            onChange={(e) => setTemplateName(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-6 w-full border-b border-color-border-input-lightmode pb-6 dark:border-color-border-input-darkmode md:mb-10 md:pb-10">
                    <div className="flex w-full">
                      <div className="shrink-0">
                        <img
                          src={getProfileImageUrlOrPlaceholder({
                            path: lesson?.ownerProfile?.profileImagePath,
                          })}
                          className="mr-4 h-[88px] w-[88px] rounded-full md:h-[140px] md:w-[140px] lg:mr-6"
                        />
                      </div>
                      <div className="flex w-full flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex grow items-center space-x-4 lg:space-x-6">
                            <div className="flex items-center space-x-2">
                              {!!lesson?.sport && (
                                <div>
                                  {lesson.sport === SportsEnum.Tennis && (
                                    <div className="flex h-5 items-center rounded-2xl bg-[#EFF9DB] px-2 text-xs text-cyan-800 lg:h-6 lg:px-3 lg:text-sm">
                                      Tennis
                                    </div>
                                  )}
                                  {lesson.sport === SportsEnum.Pickleball && (
                                    <div className="flex h-5 items-center rounded-2xl bg-[#EBF2FF] px-2 text-xs text-[#4D38AB] lg:h-6 lg:px-3 lg:text-sm">
                                      Pickleball
                                    </div>
                                  )}
                                </div>
                              )}
                              {!!lesson?.type && (
                                <div
                                  className={classNames(
                                    'mr-2 flex h-5 items-center rounded-2xl px-2 text-xs font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:h-6 md:text-sm lg:h-6',
                                    lesson?.type === LessonTypesEnum.Individual &&
                                      'bg-color-lesson-individual',
                                    lesson?.type === LessonTypesEnum.Cardio &&
                                      'bg-color-lesson-cardio',
                                    lesson?.type === LessonTypesEnum.Clinic &&
                                      'bg-color-lesson-clinic',
                                    lesson?.type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                                    lesson?.type === LessonTypesEnum.Custom &&
                                      'bg-color-lesson-other',
                                  )}
                                >
                                  {lessonShortName[lesson.type]}
                                </div>
                              )}
                            </div>
                            <div className="hidden items-center md:flex">
                              <Calendar className="h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                              <span className="ml-2 text-sm leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-lg">
                                {lessonDate}
                              </span>
                            </div>
                            <div className="hidden items-center md:flex">
                              <Clock className="h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                              <span className="ml-2 text-sm leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-lg">
                                {lessonStartTime} - {lessonEndTime}
                              </span>
                            </div>
                          </div>
                          <div className="font-semibold leading-6 lg:text-xl">
                            {!!lesson?.priceUnitAmount &&
                              convertUnitPriceToFormattedPrice(lesson.priceUnitAmount).priceDisplay}
                          </div>
                        </div>
                        <div className="flex items-center md:hidden">
                          <Calendar className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:h-5 lg:w-5" />{' '}
                          <span className="ml-2 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                            {lessonDate}
                          </span>
                        </div>
                        <div className="flex items-center md:hidden">
                          <Clock className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:h-5 lg:w-5" />{' '}
                          <span className="ml-2 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                            {lessonStartTime} - {lessonEndTime}
                          </span>
                        </div>
                        <h1 className="mb-5 mt-5 hidden text-4xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:flex lg:mb-3 lg:mt-6 lg:text-[40px] lg:leading-10">
                          {lesson?.title}
                        </h1>
                        <div className="hidden items-center md:flex">
                          <div className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            <Location className="h-4 w-4 lg:h-5 lg:w-5" />{' '}
                          </div>
                          <span className="ml-2 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                            {lesson?.userCustomCourt?.title}
                          </span>
                          <a
                            href={`https://maps.google.com?q=${lesson?.userCustomCourt?.fullAddress}`}
                            target="_blank"
                            className="ml-4 block"
                          >
                            <span className="flex items-center text-xs text-color-text-lightmode-tertiary underline dark:text-color-text-darkmode-tertiary">
                              Directions <ArrowUpRightIcon className="ml-1 w-4" />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-6 block text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:hidden">
                      {lesson?.title}
                    </h1>
                    {/* TODO: BUTTON TO OPEN WAITLIST MODAL IF NOT PARTICIPANT AND ON WAITLIST (so they can leave) */}
                    <div className="mt-4 flex items-center md:hidden">
                      <div className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                        <Location className="h-5 w-5" />{' '}
                      </div>
                      <span className="ml-2 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {lesson?.userCustomCourt?.title}
                      </span>
                      <a
                        href={`https://maps.google.com?q=${lesson?.userCustomCourt?.fullAddress}`}
                        target="_blank"
                        className="ml-4 block"
                      >
                        <span className="flex items-center text-xs text-color-text-lightmode-tertiary underline dark:text-color-text-darkmode-tertiary">
                          Directions <ArrowUpRightIcon className="ml-1 w-4" />
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="space-y-8 md:space-y-14">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <SectionHeading>Coach</SectionHeading>
                      </div>
                      <div className="mt-4 md:mt-0 md:w-1/2">
                        <Link href={getProfilePageUrl(lesson?.ownerProfile?.username)}>
                          <div className="flex items-center">
                            <img
                              src={getProfileImageUrlOrPlaceholder({
                                path: lesson?.ownerProfile?.profileImagePath,
                              })}
                              className="mr-3 h-14 w-14 rounded-full"
                            />
                            <div>
                              <div className="flex items-center">
                                <div className="font-semibold">
                                  {lesson?.ownerProfile?.fullName}
                                </div>
                                <div className="ml-1 h-5 w-5 text-color-brand-primary">
                                  <CoachBadge className="h-6 w-6" />
                                </div>
                              </div>
                              {/* <div className="text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                                @{lesson?.ownerProfile?.username}
                              </div> */}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <SectionHeading>Players going</SectionHeading>
                      </div>
                      <div className="mt-4 flex md:mt-0 md:w-1/2">
                        <div className="mr-10 text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                          {!lesson?.participantLimit
                            ? '-'
                            : `${lesson?.participants.length || '0'}/${lesson?.participantLimit}`}
                        </div>
                        {!!lesson && (
                          <div className="grid w-full grid-cols-4 gap-x-2 gap-y-4">
                            <>
                              {lesson?.participants.map((participant) => {
                                const profile = participant.userProfile;
                                const name = profile?.preferredName || profile?.fullName || '';

                                return (
                                  <ParticipantAvatar
                                    key={participant.id}
                                    name={name}
                                    username={profile?.username}
                                    avatarUrl={getProfileImageUrlOrPlaceholder({
                                      path: profile?.profileImagePath,
                                    })}
                                    isCurrentUser={viewer.userId === profile?.id}
                                  />
                                );
                              })}
                              {emptyParticipantSlots.map((_, index) => {
                                return (
                                  <ParticipantAvatar
                                    key={index}
                                    name="open"
                                    avatarUrl={EMPTY_AVATAR_SRC}
                                    isCurrentUser={false}
                                    isDisabledImage
                                  />
                                );
                              })}
                            </>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <SectionHeading>Lesson plan</SectionHeading>
                      </div>
                      <div className="mt-2 text-sm leading-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary md:mt-0 md:w-1/2">
                        {lesson?.description}
                      </div>
                    </div>
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <SectionHeading>Equipment requirements</SectionHeading>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center md:mt-0 md:w-1/2">
                        {equipmentOrder.map((item) => {
                          const matchingLesson = lesson?.equipment.find(
                            (equipment) => equipment.equipmentOptionId === item.id,
                          );

                          if (!matchingLesson) {
                            return null;
                          }

                          const { Icon, name } = item;

                          return (
                            <div
                              key={item.id}
                              className="mb-4 mr-4 flex items-center rounded-full bg-color-brand-active px-4 py-1 leading-6 text-color-brand-primary"
                            >
                              <div className="h-4 w-4">
                                <Icon />
                              </div>{' '}
                              <span className="ml-2">{name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {!!lesson?.userCustomCourt?.fullAddress && (
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <SectionHeading>Court location</SectionHeading>
                        </div>
                        <div className="mt-4 flex items-center justify-between md:mt-0 md:w-1/2">
                          <div className="flex items-center">
                            <span className="flex flex-col text-sm leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                              {lesson?.userCustomCourt?.fullAddress}
                            </span>
                          </div>
                          <a
                            href={`https://maps.google.com?q=${lesson?.userCustomCourt?.fullAddress}`}
                            target="_blank"
                            className="ml-8 block"
                          >
                            <span className="flex items-center text-sm text-color-text-lightmode-tertiary underline dark:text-color-text-darkmode-tertiary">
                              Directions <ArrowUpRightIcon className="ml-1 w-4" />
                            </span>
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <SectionHeading>Payment method</SectionHeading>
                      </div>
                      <div className="mt-2 md:mt-0 md:w-1/2">
                        <div className="w-full">
                          <div className="text-base leading-none">
                            {fulfillmentName ? (
                              fulfillmentName
                            ) : FulfillmentLogo ? (
                              <FulfillmentLogo />
                            ) : null}
                          </div>
                          <div className="mt-2 text-sm leading-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {fulfillmentDescription}
                          </div>
                        </div>
                        {
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="mt-2 text-sm leading-5 text-color-text-lightmode-tertiary underline dark:text-color-text-darkmode-tertiary"
                              onClick={() => setIsCancelPolicyVisible(!isCancelPolicyVisible)}
                            >
                              View cancellation policy
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    {isCancelPolicyVisible && (
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <SectionHeading>Cancellation policy</SectionHeading>
                        </div>
                        <div className="mt-2 flex md:mt-0 md:w-1/2">
                          <div className="shrink-0">
                            <InfoCircle className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-sm">
                            {isCoach && (
                              <div className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                                {COACH_CANCEL_POLICY}
                              </div>
                            )}
                            {isCoach
                              ? null
                              : lesson?.paymentFulfillmentChannel ===
                                  PaymentFulfillmentChannelsEnum.ParticipantsChoice && (
                                  <div className="mb-1 font-semibold text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                                    Paying with Adavntage
                                  </div>
                                )}
                            {isCoach
                              ? null
                              : (!lesson?.paymentFulfillmentChannel ||
                                  lesson?.paymentFulfillmentChannel ===
                                    PaymentFulfillmentChannelsEnum.OnPlatform ||
                                  lesson?.paymentFulfillmentChannel ===
                                    PaymentFulfillmentChannelsEnum.ParticipantsChoice) && (
                                  <div className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                                    {ON_PLATFORM_CANCEL_POLICY}
                                  </div>
                                )}
                            {isCoach
                              ? null
                              : lesson?.paymentFulfillmentChannel ===
                                  PaymentFulfillmentChannelsEnum.ParticipantsChoice && (
                                  <div className="mb-1 mt-4 font-semibold text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                                    Paying coach directly
                                  </div>
                                )}
                            {isCoach
                              ? null
                              : (lesson?.paymentFulfillmentChannel ===
                                  PaymentFulfillmentChannelsEnum.OffPlatform ||
                                  lesson?.paymentFulfillmentChannel ===
                                    PaymentFulfillmentChannelsEnum.ParticipantsChoice) && (
                                  <div className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                                    {OFF_PLATFORM_CANCEL_POLICY}
                                  </div>
                                )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!!bottomButtonGroup && (
                    <div className="mt-6 w-full md:mt-8">
                      <div className="flex w-full items-center">
                        <div className="flex w-full items-center border-t border-color-border-input-lightmode pt-6 dark:border-color-border-input-darkmode">
                          {bottomButtonGroup}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        {viewer.status === AuthStatus.Anonymous && (
          <TabBar handleSignupSuccess={handleSignupSuccess} />
        )}
      </SafeAreaPage>
      <ModalCoachCancelPrompt
        isOpen={isCoachCancelPromptModalOpen}
        setIsOpen={setIsCoachCancelPromptModalOpen}
        handleCancelComplete={() => {
          setIsCoachCancelPromptModalOpen(false);
          // NOTE (2022-01-10): There is a bug with headlessui where dialogs cannot have siblings open (they must be nested). Causes these before the translation ends adds an overflow hidden to the html that doesn't go away and scrolling is stuck.
          delayedAction(EXIT_DURATION_SAFE_MS, () => setIsCoachCancelCompleteModalOpen(true));
        }}
        lessonId={lessonId as string}
      />
      <ModalCoachCancelComplete
        isOpen={isCoachCancelCompleteModalOpen}
        setIsOpen={setIsCoachCancelCompleteModalOpen}
      />
      <ModalPlayerCancelPrompt
        isOpen={isPlayerCancelPromptModalOpen}
        setIsOpen={setIsPlayerCancelPromptModalOpen}
        handleCancelComplete={() => {
          setIsPlayerCancelPromptModalOpen(false);
          // NOTE (2022-01-10): There is a bug with headlessui where dialogs cannot have siblings open (they must be nested). Causes these before the translation ends adds an overflow hidden to the html that doesn't go away and scrolling is stuck.
          delayedAction(EXIT_DURATION_SAFE_MS, () => setIsPlayerCancelCompleteModalOpen(true));
        }}
        lessonId={lessonId as string}
        paymentFulfillmentChannel={participant?.paymentFulfillmentChannel}
        isPlayerCancelRefundable={isPlayerCancelRefundable}
        startTimeDifferenceMinutes={startTimeDifferenceMinutes}
        displayRefundPrice={displayRefundPrice}
        participantOrderDetails={participantOrderDetailsData}
        participantOrderDetailsLoading={participantOrderDetailsLoading}
        participantOrderDetailsCalled={participantOrderDetailsCalled}
      />
      <ModalPlayerCancelComplete
        isOpen={isPlayerCancelCompleteModalOpen}
        setIsOpen={setIsPlayerCancelCompleteModalOpen}
        displayRefundPrice={displayRefundPrice}
        isPlayerCancelRefundable={isPlayerCancelRefundable}
        paymentFulfillmentChannel={participant?.paymentFulfillmentChannel}
      />
      <ModalSignup
        handleSignupSuccess={handleSignupSuccess}
        isOpen={isModalSignupOpen}
        handleClose={() => setIsModalSignupOpen(false)}
      />
      <ModalWaitlist
        isOpen={isWaitlistModalOpen}
        handleClose={closeWaitlistModal}
        isOnWaitlist={isOnWaitlist}
        lessonId={lessonId as string}
        userId={viewer.userId}
        handleComplete={async () => {
          await getLessonWaitlistLazyQuery({
            variables: { lessonId },
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-and-network',
          }).catch((error) => Sentry.captureException(error));

          return;
        }}
      />
    </>
  );
};

export default LessonPage;
