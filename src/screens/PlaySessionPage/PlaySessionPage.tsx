import * as React from 'react';
import { Transition } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import { differenceInMinutes } from 'date-fns';
import { format, isPast } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import {
  PLAY_PAGE,
  getExistingPlaySessionEditPageUrl,
  getNewPlaySessionEditPageUrl,
  getPlaySessionJoinSuccessPageUrl,
  getPlaySessionPublishedPageUrl,
  getProfilePageUrl,
} from 'constants/pages';
import { DUPR_IMAGES } from 'constants/sports';
import { SkillLevels } from 'constants/sports';
import { EMPTY_AVATAR_SRC } from 'constants/user';
import {
  PlaySessionParticipantStatusesEnum, // PlaySessionFormatsEnum,
  PlaySessionStatusesEnum,
  SportsEnum,
  useGetPlaySessionByIdLazyQuery,
  useGetPlaySessionCommentsLazyQuery,
  useInsertPlaySessionCommentMutation,
  useInsertUserGroupMembershipMutation,
  useSetPlaySessionAsActiveMutation,
} from 'types/generated/client';
import { delayedAction } from 'utils/client/delayedAction';
import { getGoogleMapsAddressUrl } from 'utils/shared/location/getGoogleMapsAddressUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAuthModals } from 'hooks/useAuthModals';
import { useAutosizeTextArea } from 'hooks/useAutosizeTextArea';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Calendar from 'svg/Calendar';
import ChatBubble from 'svg/ChatBubble';
import Clock from 'svg/Clock';
import CloseIcon from 'svg/CloseIcon';
import Directions from 'svg/Directions';
import InfoCircle from 'svg/InfoCircle';
import Location from 'svg/Location';
import Send from 'svg/Send';
import Trash from 'svg/Trash';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Comment from 'components/Comment';
import Link from 'components/Link';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import ParticipantAvatar from 'components/ParticipantAvatar';
import { EXIT_DURATION_SAFE_MS } from 'components/modals/Modal/Modal';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import ModalJoin from './ModalJoin';
import ModalOrganizerCancelComplete from './ModalOrganizerCancelComplete';
import ModalOrganizerCancelPrompt from './ModalOrganizerCancelPrompt';
import ModalPlayerCancelComplete from './ModalPlayerCancelComplete';
import ModalPlayerCancelPrompt from './ModalPlayerCancelPrompt';
import SectionHeading from './SectionHeading';
import ShareButton from './ShareButton';
import { Props } from './props';
import { BackgroundImage } from './styles';

const FORM_ID = 'publish-form';
const COMMENTS_ID = 'comments';
const IS_HIDE_SIDEBAR = true;
const MAX_PARTICIPANTS_DISPLAYED_MOBILE = 5;
const MAX_PARTICIPANTS_DISPLAYED_DESKTOP = 7;
const DEFAULT_COMMENT_HEIGHT_PX = 42;

const PageWrapper = ({
  children,
  isModal,
  handleSignupSuccess,
}: {
  children: React.ReactNode;
  isModal?: boolean;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
}) => {
  if (isModal) {
    return <div className="h-full">{children}</div>;
  } else {
    return (
      <SafeAreaPage
        handleSignupSuccess={handleSignupSuccess}
        isHideSidebar={IS_HIDE_SIDEBAR}
        isIgnoreMobileTabs
      >
        <div className="flex h-full grow flex-col">{children}</div>
      </SafeAreaPage>
    );
  }
};

const PlaySessionPage = ({
  isNewPlaySession,
  injectedPlaySessionId,
  isModal,
  closeModal,
  fetchPlaySessions,
}: Props) => {
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const { ModalLogin, ModalSignup, openSignupModal } = useAuthModals();
  const { textAreaRef } = useAutosizeTextArea({ initialHeightPx: DEFAULT_COMMENT_HEIGHT_PX });
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const playSessionId = router?.query?.playSessionId || injectedPlaySessionId || '';
  const [isCommenting, setIsCommenting] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [isModalJoinOpen, setIsModalJoinOpen] = React.useState(false);
  const [isViewAllParticipants, setIsViewAllParticipants] = React.useState(false);
  const [isOrganizerCancelPromptModalOpen, setIsOrganizerCancelPromptModalOpen] =
    React.useState(false);
  const [isOrganizerCancelCompleteModalOpen, setIsOrganizerCancelCompleteModalOpen] =
    React.useState(false);
  const [isPlayerCancelPromptModalOpen, setIsPlayerCancelPromptModalOpen] = React.useState(false);
  const [insertUserGroupMembershipMutation] = useInsertUserGroupMembershipMutation();
  const [isPlayerCancelCompleteModalOpen, setIsPlayerCancelCompleteModalOpen] =
    React.useState(false);
  const [getPlaySessionByIdLazyQuery, { data, loading, called }] = useGetPlaySessionByIdLazyQuery();
  const [setPlaySessionAsActiveMutation, { loading: publishLoading }] =
    useSetPlaySessionAsActiveMutation();
  const [insertPlaySessionCommentMutation, { loading: isInsertPlaySessionCommentMutationLoading }] =
    useInsertPlaySessionCommentMutation();
  const [
    getPlaySessionCommentsLazyQuery,
    { data: comments, loading: iGetPlaySessionCommentsLazyQueryLoading },
  ] = useGetPlaySessionCommentsLazyQuery();
  const playSession = data?.playSessionsByPk;
  const isOrganizer = playSession?.organizerUserId === viewer.userId;
  const activeParticipants = (playSession?.participants || []).filter(
    (p) => p.status === PlaySessionParticipantStatusesEnum.Active,
  );
  const activeParticipantsMobile = activeParticipants.slice(
    0,
    isViewAllParticipants
      ? (playSession?.participants || []).length
      : MAX_PARTICIPANTS_DISPLAYED_MOBILE,
  );
  const activeParticipantsDesktop = activeParticipants.slice(
    0,
    isViewAllParticipants
      ? (playSession?.participants || []).length
      : MAX_PARTICIPANTS_DISPLAYED_DESKTOP,
  );
  const participant = (playSession?.participants || []).find(
    (p) => p.userProfile?.id === viewer.userId,
  );
  const participantLimit = playSession?.participantLimit || 0;
  const participantCount = activeParticipants.length || 0;
  const emptyParticipantSlotsMobile = new Array(
    !participantLimit // NOTE: no limited means unlimited
      ? 0
      : Math.max(
          (isViewAllParticipants
            ? participantLimit
            : Math.min(participantLimit, MAX_PARTICIPANTS_DISPLAYED_MOBILE)) - participantCount,
          0,
        ),
  ).fill(null);
  const emptyParticipantSlotsDesktop = new Array(
    !participantLimit // NOTE: no limited means unlimited
      ? 0
      : Math.max(
          (isViewAllParticipants
            ? participantLimit
            : Math.min(participantLimit, MAX_PARTICIPANTS_DISPLAYED_DESKTOP)) - participantCount,
          0,
        ),
  ).fill(null);
  const organizerParticipant = (playSession?.participants || []).find(
    (p) => p.userProfile?.id === playSession?.organizerUserId,
  );
  const startDateTime = playSession?.startDateTime;
  const playSessionDate = !!startDateTime && format(new Date(startDateTime), 'eeee MMM. d');
  const playSessionStartTime = !!startDateTime && format(new Date(startDateTime), 'p');
  const playSessionEndTime =
    !!playSession?.endDateTime && format(new Date(playSession.endDateTime), 'p');
  const startTimeDifferenceMinutes = startDateTime
    ? differenceInMinutes(new Date(startDateTime), new Date())
    : 0;
  const skillRatingMinimum = playSession?.skillRatingMinimum;
  const skillRatingMaximum = playSession?.skillRatingMaximum;
  const skillRatingText = !skillRatingMaximum
    ? 'All Levels'
    : `${(skillRatingMinimum || 0).toFixed(2)}-${skillRatingMaximum?.toFixed(2)}`;
  const skillImagePreset = DUPR_IMAGES.find((preset) => {
    if (!skillRatingMaximum && !preset.maxRating) {
      return true;
    }

    return (skillRatingMaximum || 0) <= (preset.maxRating || 0);
  });
  const skillImageMobileUrl = skillImagePreset?.mobileHeaderPath;
  const skillImageDesktopUrl = skillImagePreset?.desktopHeaderPath;
  const location = playSession?.venue?.title || playSession?.userCustomCourt?.title;
  const address =
    playSession?.venue?.addressString || playSession?.userCustomCourt?.fullAddress || '';
  const directionsString = getGoogleMapsAddressUrl(address);
  const isDisabled = loading || !called || publishLoading;
  let topButtonGroup;
  let bottomButtonGroup;

  if (isNewPlaySession) {
    // topButtonGroup = (
    //   <button
    //     className="button-rounded-inline-primary px-4 text-xs font-semibold"
    //     type="submit"
    //     disabled={isDisabled}
    //   >
    //     Publish
    //   </button>
    // );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        {isDisabled ? (
          <span className="button-rounded-full-primary-inverted block w-1/2 text-center lg:w-auto lg:px-10">
            Edit
          </span>
        ) : (
          <Link
            className="button-rounded-full-primary-inverted block w-1/2 text-center lg:w-auto lg:px-10"
            href={getNewPlaySessionEditPageUrl(playSessionId as string)}
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
  } else if (!playSession || viewer.status === AuthStatus.Loading) {
    topButtonGroup = null;
    bottomButtonGroup = null;
  } else if (isPast(new Date(playSession.startDateTime))) {
    topButtonGroup = <ShareButton id={playSessionId as string} isInline isPrimary />;
    bottomButtonGroup = null;
  } else if (viewer.status === AuthStatus.Anonymous) {
    // topButtonGroup = (
    //   <button
    //     type="button"
    //     onClick={() => openSignupModal(true)}
    //     className="button-rounded-inline-primary px-4 text-xs font-semibold"
    //   >
    //     Join
    //   </button>
    // );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end">
        <ShareButton
          id={playSessionId as string}
          className="w-1/2"
          isInline={false}
          isPrimary={false}
        />
        <button
          type="button"
          onClick={() => openSignupModal(true)}
          className="button-rounded-full-primary w-1/2 lg:px-10"
        >
          Join
        </button>
      </div>
    );
  } else if (participant && participant.status === PlaySessionParticipantStatusesEnum.Inactive) {
    // topButtonGroup = (
    //   <button
    //     type="button"
    //     onClick={() => setIsModalJoinOpen(true)}
    //     className="button-rounded-inline-primary px-4 text-xs font-semibold"
    //   >
    //     Join Again
    //   </button>
    // );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end lg:space-x-6">
        <ShareButton
          id={playSessionId as string}
          className="w-1/2"
          isInline={false}
          isPrimary={false}
        />
        <button
          type="button"
          onClick={() => setIsModalJoinOpen(true)}
          className="button-rounded-full-primary w-1/2 lg:px-10"
        >
          Join Again
        </button>
      </div>
    );
  } else if (playSession.status === PlaySessionStatusesEnum.Canceled) {
    topButtonGroup = null;
    bottomButtonGroup = null; // TODO: Show canceled message
  } else if (playSession.status === PlaySessionStatusesEnum.Pending) {
    topButtonGroup = null;
    bottomButtonGroup = null; // TODO: Show not published message
  } else if (isOrganizer) {
    // topButtonGroup = <ShareButton />;
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end lg:space-x-6">
        <button
          type="button"
          form={FORM_ID}
          disabled={isDisabled}
          className="button-rounded-full-primary-inverted w-auto shrink-0 px-4 md:px-3"
          onClick={() => setIsOrganizerCancelPromptModalOpen(true)}
        >
          <Trash className="h-6 w-6" />
        </button>
        {isDisabled ? (
          <span className="button-rounded-full-primary-inverted block w-1/2 text-center lg:px-10">
            Modify <span className="hidden lg:inline">Session</span>
          </span>
        ) : (
          <Link
            className="button-rounded-full-primary-inverted block w-1/2 text-center lg:px-10"
            href={getExistingPlaySessionEditPageUrl(playSessionId as string)}
          >
            Modify <span className="hidden lg:inline">Session</span>
          </Link>
        )}
        <ShareButton
          id={playSessionId as string}
          className="w-1/2"
          isInline={false}
          isPrimary={true}
        />
      </div>
    );
  } else if (!!participant && participant.status === PlaySessionParticipantStatusesEnum.Active) {
    // topButtonGroup = <ShareButton />;
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end lg:space-x-6">
        <button
          onClick={() => setIsPlayerCancelPromptModalOpen(true)}
          type="button"
          className="button-rounded-full-primary-inverted block w-1/2 text-center lg:px-10"
        >
          Leave
        </button>
        <ShareButton
          id={playSessionId as string}
          className="w-1/2"
          isInline={false}
          isPrimary={true}
        />
      </div>
    );
  } else {
    // topButtonGroup = (
    //   <button
    //     type="button"
    //     onClick={() => setIsModalJoinOpen(true)}
    //     className="button-rounded-inline-primary px-4 text-xs font-semibold"
    //   >
    //     Join
    //   </button>
    // );
    bottomButtonGroup = (
      <div className="flex w-full items-center space-x-4 lg:justify-end lg:space-x-6">
        <ShareButton
          id={playSessionId as string}
          className="w-1/2"
          isInline={false}
          isPrimary={false}
        />
        <button
          type="button"
          onClick={() => setIsModalJoinOpen(true)}
          className="button-rounded-full-primary w-1/2 lg:px-10"
        >
          Join
        </button>
      </div>
    );
  }

  React.useEffect(() => {
    const fetchPlaySession = async (playSessionId: string, userId?: string | null) => {
      getPlaySessionByIdLazyQuery({
        variables: { id: playSessionId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      }).catch((error) => Sentry.captureException(error));
      getPlaySessionCommentsLazyQuery({
        fetchPolicy: 'cache-and-network',
        variables: {
          playSessionId: playSessionId as string,
        },
      }).catch((error) => Sentry.captureException(error));
    };

    if (router.isReady && viewer.status !== AuthStatus.Loading && playSessionId) {
      fetchPlaySession(playSessionId as string, viewer.userId);
    }
  }, [router.isReady, viewer.status, playSessionId]);

  React.useEffect(() => {
    if (isCommenting) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 500);
    }
  }, [isCommenting]);

  const handleSignupSuccess = async ({ userId }: { userId: string }) => {
    const groupId = playSession?.groupId;

    if (userId && groupId) {
      await insertUserGroupMembershipMutation({
        variables: {
          userId: userId,
          groupId: groupId,
        },
      });
    }
  };

  return (
    <>
      <Head
        title="Play Session"
        description="Your Bounce play session"
        ogImage={`${process.env.APP_URL}/api/v1/play-sessions/${playSessionId}/images/og`}
      />
      <PageWrapper handleSignupSuccess={handleSignupSuccess} isModal={isModal}>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            {isModal && (
              <BackgroundImage
                className="bg-cover bg-no-repeat"
                desktopImageUrl={!playSession ? '' : skillImageDesktopUrl || ''}
                mobileImageUrl={!playSession ? '' : skillImageMobileUrl || ''}
              >
                <div className="flex w-full shrink-0 items-center justify-between px-4 py-6 text-color-text-darkmode-primary">
                  <div className="flex items-center font-semibold">
                    <span className="mr-1 text-sm">DUPR</span> {skillRatingText}
                  </div>
                  <button
                    onClick={() => !!closeModal && closeModal()}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-color-bg-lightmode-primary text-color-text-lightmode-primary"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </BackgroundImage>
            )}
            <div
              ref={scrollBodyRef}
              className={classNames(
                'flex h-full w-full grow flex-col items-center overflow-y-auto pb-6',
                isModal && 'pt-6',
              )}
            >
              {!isModal && (
                <FixedPageTitle
                  title=""
                  isPop
                  right={topButtonGroup}
                  isBackdropBlur
                  isHideSidebar={IS_HIDE_SIDEBAR}
                />
              )}
              <div className="flex w-full flex-col px-4 md:px-10 lg:max-w-main-content-container">
                <div className="mb-6 w-full shrink-0 pb-6">
                  <div className="flex w-full">
                    <div className="flex w-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex grow items-center space-x-4 lg:space-x-6">
                          {/* <div className="flex items-center space-x-2">
                              {!!playSession?.sport && (
                                <div>
                                  {playSession.sport === SportsEnum.Tennis && (
                                    <div className="flex h-5 items-center rounded-2xl bg-[#EFF9DB] px-2 text-xs text-cyan-800 lg:h-6 lg:px-3 lg:text-sm">
                                      Tennis
                                    </div>
                                  )}
                                  {playSession.sport === SportsEnum.Pickleball && (
                                    <div className="flex h-5 items-center rounded-2xl bg-[#EBF2FF] px-2 text-xs text-[#4D38AB] lg:h-6 lg:px-3 lg:text-sm">
                                      Pickleball
                                    </div>
                                  )}
                                </div>
                              )}
                            </div> */}
                          {/* {playSession?.targetSkillLevel && (
                              <div className="flex items-center" style={{ marginLeft: '0.5rem' }}>
                                {!playSession.targetSkillLevel && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#EFF9DB] px-2 text-xs text-[#155E75] lg:h-6 lg:px-3 lg:text-sm">
                                    All Skill Levels
                                  </div>
                                )}
                                {playSession.targetSkillLevel === SkillLevels.BrandNew && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#EFF9DB] px-2 text-xs text-[#155E75] lg:h-6 lg:px-3 lg:text-sm">
                                    Brand New
                                  </div>
                                )}
                                {playSession.targetSkillLevel === SkillLevels.Beginner && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#F0F9FF] px-2 text-xs text-[##316BDA] lg:h-6 lg:px-3 lg:text-sm">
                                    Beginner
                                  </div>
                                )}
                                {playSession.targetSkillLevel === SkillLevels.Intermediate && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#FBF8E5] px-2 text-xs text-[#AF7400] lg:h-6 lg:px-3 lg:text-sm">
                                    Intermediate
                                  </div>
                                )}
                                {playSession.targetSkillLevel === SkillLevels.Advanced && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#FFECDE] px-2 text-xs text-[#ED4F2F] lg:h-6 lg:px-3 lg:text-sm">
                                    Advanced
                                  </div>
                                )}
                                {playSession.targetSkillLevel === SkillLevels.Pro && (
                                  <div className="flex h-5 items-center rounded-2xl bg-[#FFEEF4] px-2 text-xs text-[#86175A] lg:h-6 lg:px-3 lg:text-sm">
                                    Pro
                                  </div>
                                )}
                              </div>
                            )} */}
                          {!!playSession?.title && (
                            <h1 className="mb-2 block text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:text-3xl md:leading-10">
                              {playSession?.title}
                            </h1>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-8">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon lg:h-5 lg:w-5" />{' '}
                          <span className="ml-1.5 text-sm leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {playSessionDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon lg:h-5 lg:w-5" />{' '}
                          <span className="ml-1.5 text-sm leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {playSessionStartTime} - {playSessionEndTime}
                          </span>
                        </div>
                      </div>
                      {!!location && (
                        <div className="mt-3 hidden items-center justify-between md:flex">
                          <div className="flex items-center">
                            <div className="text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon">
                              <Location className="h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon lg:h-5 lg:w-5" />{' '}
                            </div>
                            <span className="ml-1.5 text-sm leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                              {location}
                            </span>
                          </div>
                          {!!directionsString && (
                            <a href={directionsString} target="_blank" className="ml-4 block">
                              <span className="flex items-center font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                <Directions className="mr-1 w-4" /> Directions
                              </span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!!location && (
                    <div className="flex items-center justify-between md:hidden">
                      <div className="flex items-center">
                        <div className="text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon">
                          <Location className="w-4" />{' '}
                        </div>
                        <span className="ml-1.5 text-sm leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          {location}
                        </span>
                      </div>
                      {!!directionsString && (
                        <a href={directionsString} target="_blank" className="ml-4 block shrink-0">
                          <span className="flex items-center font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                            <Directions className="mr-1 w-4" /> Directions
                          </span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-8 md:space-y-14">
                  <div>
                    <div className="mb-3">
                      <div>
                        <SectionHeading>
                          <span>
                            <span className="mr-2">Players going</span>
                            {!playSession
                              ? ''
                              : !playSession.participantLimit
                              ? `${activeParticipants.length || '0'}/unlimited`
                              : `${activeParticipants.length || '0'}/${
                                  playSession?.participantLimit
                                }`}
                          </span>
                        </SectionHeading>
                      </div>
                      <div className="mt-4 flex">
                        {!!playSession && (
                          <>
                            <div className="grid w-full grid-cols-5 gap-x-1 gap-y-4 md:hidden">
                              <>
                                <ParticipantAvatar
                                  name={organizerParticipant?.userProfile?.fullName || ''}
                                  username={organizerParticipant?.userProfile?.username || ''}
                                  avatarUrl={getProfileImageUrlOrPlaceholder({
                                    path: organizerParticipant?.userProfile?.profileImagePath,
                                  })}
                                  isCurrentUser={
                                    viewer.userId === organizerParticipant?.userProfile?.id
                                  }
                                />
                                {activeParticipantsMobile.map((participant) => {
                                  const profile = participant.userProfile;
                                  const name = profile?.preferredName || profile?.fullName || '';

                                  const ignoreOrganizerIfAlreadyDisplayed =
                                    profile?.id === organizerParticipant?.userProfile?.id;
                                  if (
                                    !!organizerParticipant?.userProfile &&
                                    ignoreOrganizerIfAlreadyDisplayed
                                  ) {
                                    return null;
                                  }

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
                                {emptyParticipantSlotsMobile.map((_, index) => {
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
                            <div className="hidden w-full grid-cols-7 gap-x-1 gap-y-4 md:grid">
                              <>
                                <ParticipantAvatar
                                  name={organizerParticipant?.userProfile?.fullName || ''}
                                  username={organizerParticipant?.userProfile?.username || ''}
                                  avatarUrl={getProfileImageUrlOrPlaceholder({
                                    path: organizerParticipant?.userProfile?.profileImagePath,
                                  })}
                                  isCurrentUser={
                                    viewer.userId === organizerParticipant?.userProfile?.id
                                  }
                                />
                                {activeParticipantsDesktop.map((participant) => {
                                  const profile = participant.userProfile;
                                  const name = profile?.preferredName || profile?.fullName || '';

                                  const ignoreOrganizerIfAlreadyDisplayed =
                                    profile?.id === organizerParticipant?.userProfile?.id;
                                  if (
                                    !!organizerParticipant?.userProfile &&
                                    ignoreOrganizerIfAlreadyDisplayed
                                  ) {
                                    return null;
                                  }

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
                                {emptyParticipantSlotsDesktop.map((_, index) => {
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
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'mt-1 justify-end',
                        !participantLimit &&
                          participantCount > MAX_PARTICIPANTS_DISPLAYED_MOBILE &&
                          'flex',
                        !participantLimit &&
                          participantCount <= MAX_PARTICIPANTS_DISPLAYED_MOBILE &&
                          'hidden',
                        !participantLimit &&
                          participantCount > MAX_PARTICIPANTS_DISPLAYED_DESKTOP &&
                          'md:flex',
                        !participantLimit &&
                          participantCount <= MAX_PARTICIPANTS_DISPLAYED_DESKTOP &&
                          'md:hidden',
                        !!participantLimit &&
                          participantLimit > MAX_PARTICIPANTS_DISPLAYED_MOBILE &&
                          'flex',
                        !!participantLimit &&
                          participantLimit <= MAX_PARTICIPANTS_DISPLAYED_MOBILE &&
                          'hidden',
                        !!participantLimit &&
                          participantLimit > MAX_PARTICIPANTS_DISPLAYED_DESKTOP &&
                          'md:flex',
                        !!participantLimit &&
                          participantLimit <= MAX_PARTICIPANTS_DISPLAYED_DESKTOP &&
                          'md:hidden',
                      )}
                    >
                      <button
                        className="text-base font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                        onClick={() => setIsViewAllParticipants(!isViewAllParticipants)}
                      >
                        {isViewAllParticipants ? 'View less' : 'View all'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full border-t border-color-border-input-lightmode pt-6 dark:border-color-border-input-darkmode">
                <div
                  id={COMMENTS_ID}
                  className="mx-auto px-4 md:max-w-main-content-container md:px-10"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      Comments {comments?.playSessionComments.length || 0}
                    </h2>
                    {!isNewPlaySession && (
                      <button
                        type="button"
                        className="flex items-center"
                        onClick={() => {
                          scrollBodyRef.current?.scrollTo({
                            top: scrollBodyRef.current?.scrollHeight,
                            behavior: 'smooth',
                          });
                          setTimeout(() => {
                            textAreaRef.current?.focus();
                          }, 500);
                        }}
                      >
                        <ChatBubble className="mr-1 h-4 w-4" />
                        <span className="font-medium">Add comment</span>
                      </button>
                    )}
                  </div>
                  <div className="mt-6 space-y-6">
                    {comments?.playSessionComments?.map((comment) => {
                      return (
                        <Comment
                          key={comment.id}
                          id={comment.id}
                          content={comment.content}
                          senderName={comment?.userProfile?.fullName}
                          senderUsername={comment?.userProfile?.username}
                          senderProfileImageUrl={getProfileImageUrlOrPlaceholder({
                            path: comment?.userProfile?.profileImagePath,
                          })}
                          timestamp={comment.createdAt}
                          type="play"
                        />
                      );
                    })}
                  </div>
                  {!isNewPlaySession && (
                    <div
                      className={classNames(
                        'mt-6 border-t border-color-border-input-lightmode pt-6 dark:border-color-border-input-darkmode',
                        isCommenting && 'pb-16',
                      )}
                    >
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          await insertPlaySessionCommentMutation({
                            variables: {
                              playSessionId: playSessionId as string,
                              content: commentText,
                              userId: viewer.userId,
                              playSessionCommentId: null,
                              playSessionRootCommentId: null,
                            },
                          });
                          setCommentText('');
                          getPlaySessionCommentsLazyQuery({
                            fetchPolicy: 'network-only',
                            variables: {
                              playSessionId: playSessionId as string,
                            },
                          }).then(() => {
                            setTimeout(() => {
                              scrollBodyRef.current?.scrollTo({
                                top: scrollBodyRef.current?.scrollHeight,
                                behavior: 'smooth',
                              });
                            }, 200);
                          });
                          setIsCommenting(false);
                        }}
                        className="flex w-full items-center pb-2"
                      >
                        <img
                          className="h-8 w-8 rounded-full"
                          src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                        />
                        <div className="relative ml-2 flex w-full items-center">
                          <textarea
                            ref={textAreaRef}
                            disabled={isInsertPlaySessionCommentMutationLoading}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment"
                            className="h-[42px] max-h-20 w-full grow resize-none rounded-3xl border-none bg-color-bg-input-lightmode-primary py-[9px] pl-3.5 pr-12 text-base disabled:opacity-60 dark:bg-color-bg-input-darkmode-primary"
                          />
                          <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center pr-2">
                            <button
                              disabled={isInsertPlaySessionCommentMutationLoading}
                              type="submit"
                              className="flex items-center justify-center rounded-full bg-color-bg-lightmode-brand p-2 text-color-text-lightmode-invert disabled:opacity-60 dark:bg-color-bg-darkmode-brand"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!!bottomButtonGroup && (
              <form
                id={FORM_ID}
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!isNewPlaySession) {
                    return;
                  }

                  try {
                    if (playSession) {
                      const response = await setPlaySessionAsActiveMutation({
                        variables: {
                          id: playSession.id,
                        },
                      });

                      if (response.errors) {
                        Sentry.captureException(response.errors);
                        toast.error('Error publishing play session');
                      } else {
                        router.push(getPlaySessionPublishedPageUrl(playSessionId as string));
                      }
                    } else {
                      throw new Error('Play session not found');
                    }
                  } catch (error) {
                    Sentry.captureException(error);
                  }
                }}
              >
                <div className="w-full py-4 shadow-tabs">
                  <div className="flex w-full items-center">
                    <div className="mx-auto flex w-full items-center px-4 lg:max-w-main-content-container lg:px-8">
                      {bottomButtonGroup}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        {viewer.status === AuthStatus.Anonymous && !bottomButtonGroup && (
          <TabBar handleSignupSuccess={handleSignupSuccess} />
        )}
        <Transition
          show={isCommenting}
          className="fixed bottom-0 left-0 z-10 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary dark:bg-color-bg-darkmode-primary"
          enter="transition-all ease-in-out duration-200"
          enterFrom="opacity-0 translate-y-8"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 translate-y-8"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              await insertPlaySessionCommentMutation({
                variables: {
                  playSessionId: playSessionId as string,
                  content: commentText,
                  userId: viewer.userId,
                  playSessionCommentId: null,
                  playSessionRootCommentId: null,
                },
              });
              setCommentText('');
              getPlaySessionCommentsLazyQuery({
                fetchPolicy: 'network-only',
                variables: {
                  playSessionId: playSessionId as string,
                },
              }).then(() => {
                setTimeout(() => {
                  scrollBodyRef.current?.scrollTo({
                    top: scrollBodyRef.current?.scrollHeight,
                    behavior: 'smooth',
                  });
                }, 200);
              });
              setIsCommenting(false);
            }}
            className="flex w-screen items-center px-4 py-2 shadow-tabs md:hidden"
          >
            <img
              className="h-8 w-8 rounded-full"
              src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
            />
            <textarea
              ref={textAreaRef}
              disabled={isInsertPlaySessionCommentMutationLoading}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mx-2 h-[42px] max-h-20 w-full grow resize-none rounded-3xl border-none bg-color-bg-input-lightmode-primary px-3.5 py-[9px] text-base disabled:opacity-60 dark:bg-color-bg-input-darkmode-primary"
            />
            <button
              disabled={isInsertPlaySessionCommentMutationLoading}
              type="submit"
              className="disabled:opacity-60"
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </Transition>
      </PageWrapper>
      <ModalOrganizerCancelPrompt
        isOpen={isOrganizerCancelPromptModalOpen}
        setIsOpen={setIsOrganizerCancelPromptModalOpen}
        handleCancelComplete={() => {
          setIsOrganizerCancelPromptModalOpen(false);
          // NOTE (2022-01-10): There is a bug with headlessui where dialogs cannot have siblings open (they must be nested). Causes these before the translation ends adds an overflow hidden to the html that doesn't go away and scrolling is stuck.
          delayedAction(EXIT_DURATION_SAFE_MS, () => setIsOrganizerCancelCompleteModalOpen(true));
        }}
        playSessionId={playSessionId as string}
      />
      <ModalOrganizerCancelComplete
        isOpen={isOrganizerCancelCompleteModalOpen}
        setIsOpen={setIsOrganizerCancelCompleteModalOpen}
        handleCancelComplete={
          isModal
            ? () => (fetchPlaySessions ? fetchPlaySessions() : router.reload())
            : () => router.push(PLAY_PAGE)
        }
      />
      <ModalPlayerCancelPrompt
        isOpen={isPlayerCancelPromptModalOpen}
        setIsOpen={setIsPlayerCancelPromptModalOpen}
        handleCancelComplete={() => {
          setIsPlayerCancelPromptModalOpen(false);
          // NOTE (2022-01-10): There is a bug with headlessui where dialogs cannot have siblings open (they must be nested). Causes these before the translation ends adds an overflow hidden to the html that doesn't go away and scrolling is stuck.
          delayedAction(EXIT_DURATION_SAFE_MS, () => setIsPlayerCancelCompleteModalOpen(true));
        }}
        playSessionId={playSessionId as string}
        startTimeDifferenceMinutes={startTimeDifferenceMinutes}
      />
      <ModalPlayerCancelComplete
        isOpen={isPlayerCancelCompleteModalOpen}
        setIsOpen={setIsPlayerCancelCompleteModalOpen}
        handleCancelComplete={
          isModal
            ? () => (fetchPlaySessions ? fetchPlaySessions() : router.reload())
            : () => router.push(PLAY_PAGE)
        }
      />
      <ModalSignup handleSignupSuccess={handleSignupSuccess} isShowLoginLink />
      <ModalLogin isShowSignupLink />
      <ModalJoin
        isOpen={isModalJoinOpen}
        setIsOpen={setIsModalJoinOpen}
        playSessionId={playSessionId as string}
        handleJoinComplete={() => {
          router.push(getPlaySessionJoinSuccessPageUrl(playSessionId as string));
        }}
      />
    </>
  );
};

export default PlaySessionPage;
