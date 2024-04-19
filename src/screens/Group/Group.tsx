import * as React from 'react';
import Sticky from 'react-sticky-el';
import {
  SIGNUP_CODE_PAGE,
  SIGNUP_PAGE,
  getMyGroupMembersPageUrl,
  getMyGroupThreadPageUrl,
  getMyGroupVenuesPageUrl,
} from 'constants/pages';
import {
  CommentVoteEnum,
  useGetGroupByIdLazyQuery,
  useGetUserGroupsLazyQuery,
  useUpsertGroupThreadVoteMutation,
} from 'types/generated/client';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { pluralize } from 'utils/shared/pluralize';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import ChampionBadge from 'svg/ChampionBadge';
import ChatBubble from 'svg/ChatBubble';
import CourtFlatIcon from 'svg/CourtFlat';
import GroupIcon from 'svg/Group';
import Location from 'svg/Location';
import Photograph from 'svg/Photograph';
import Send from 'svg/Send';
import Share from 'svg/Share';
import ThumbUp from 'svg/ThumbUp';
import TabPageScrollPage from 'layouts/TabPageScrollPage';
import Comment from 'components/Comment';
import CoverImageBackground from 'components/CoverImageBackground';
import Link from 'components/Link';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import ModalCreateThread from './ModalCreateThread';
import ModalInvite from './ModalInvite';

const DEFAULT_COVER_IMAGE_MOBILE = '/images/app/group-cover-default-mobile.png';
const DEFAULT_COVER_IMAGE_DESKTOP = '/images/app/group-cover-default-mobile.png';
const DEFAULT_COMMENT_HEIGHT_PX = 42;
const ORIGINAl_COMMENT = 1;

const ButtonLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      className="flex items-center justify-center rounded-3xl border border-color-bg-lightmode-invert px-5 py-2 text-center text-base font-medium text-color-text-lightmode-primary dark:border-color-bg-darkmode-invert dark:text-color-text-darkmode-primary"
      href={href}
    >
      {children}
    </Link>
  );
};

/**
 * @todo upload image immediate and insert. If they deleted it, set deletedAt to null.
 */

export default function Group() {
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const {
    isOpen: isModalInviteOpen,
    openModal: openModalInvite,
    closeModal: closeModalInvite,
  } = useModal();
  const {
    isOpen: isModaCreateThreadOpen,
    openModal: openModalCreateThread,
    closeModal: closeModalCreateThread,
  } = useModal();
  const { userId } = useViewer();
  const { user } = useGetCurrentUser();
  const [
    getUserGroupsLazyQuery,
    { data: userGroupData, loading: isUserGroupsLoading, called: isUserGroupsCalled },
  ] = useGetUserGroupsLazyQuery();
  const [
    getGroupByIdLazyQuery,
    { data: groupData, loading: isGroupLoading, called: isGroupCalled },
  ] = useGetGroupByIdLazyQuery();
  const [upsertGroupThreadVoteMutation, { loading: upsertGroupThreadVoteMutationLoading }] =
    useUpsertGroupThreadVoteMutation();
  const groupMembership = user?.groups?.[0];
  const group = groupData?.groupsByPk;
  const displayCoverImageMobileUrl = DEFAULT_COVER_IMAGE_MOBILE;
  const displayCoverImageDesktopUrl = DEFAULT_COVER_IMAGE_DESKTOP;
  const shareUrl = group?.accessCode
    ? `${process.env.APP_URL}${SIGNUP_PAGE}?code=${group?.accessCode}`
    : `${process.env.APP_URL}${SIGNUP_CODE_PAGE}`;

  React.useEffect(() => {
    if (userId && user) {
      if (groupMembership) {
        getGroupByIdLazyQuery({
          fetchPolicy: 'cache-and-network',
          variables: {
            id: groupMembership.groupId,
            userId: userId,
            // userId: userId || uuid(), // NOTE: In case it's anonymous, let it run?
          },
        });
      } else {
        getUserGroupsLazyQuery({
          fetchPolicy: 'network-only',
          variables: {
            id: userId,
          },
        }).then((groupData) => {
          const userGroups = groupData?.data?.usersByPk?.groups;
          const primaryGroup = userGroups?.[0];

          if (primaryGroup) {
            return getGroupByIdLazyQuery({
              fetchPolicy: 'network-only',
              variables: {
                id: primaryGroup.groupId,
                userId: userId,
                // userId: userId || uuid(), // NOTE: In case it's anonymous, let it run?
              },
            });
          }
        });
      }
    }
  }, [userId, user, groupMembership]);

  if (!groupMembership || !group) {
    /**
     * @todo handle people in no group
     */
  }

  return (
    <>
      <Head noIndex title="Group" />
      <TabPageScrollPage ignoreSafeTop>
        <div className="relative flex h-full grow flex-col pb-16">
          <div className="absolute right-4 top-4 lg:hidden">
            <button
              onClick={() => {
                openModalInvite();

                if (navigator.share) {
                  navigator
                    .share({
                      title: `${group?.title} on Bounce`,
                      text: `Join ${group?.title} on Bounce, the pickleball app.`,
                      url: shareUrl,
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing:', error));
                }
              }}
              className="button-rounded-inline-darkmode-only flex items-center justify-center px-4 py-1.5"
            >
              <Share className="mr-1 h-[1.125rem] w-[1.125rem]" />{' '}
              <span className="text-base font-medium">Invite</span>
            </button>
          </div>
          <CoverImageBackground
            coverImageUrl={displayCoverImageMobileUrl}
            className="h-24 w-full lg:hidden"
          />
          <CoverImageBackground
            coverImageUrl={displayCoverImageDesktopUrl}
            className="hidden h-[7.5rem] w-full lg:block"
          />
          <div className="relative z-10 -mt-12 flex flex-col px-6 sm:-mt-8 lg:flex-row lg:border-b lg:border-color-border-input-lightmode lg:pb-5 dark:lg:border-color-border-input-darkmode">
            <div className="flex shrink-0 justify-center lg:justify-start">
              <div className="relative">
                <img
                  className={classNames(
                    'relative h-24 w-24 shrink-0 rounded-full object-cover object-center ring-2 ring-white sm:h-[8.75rem] sm:w-[8.75rem]',
                  )}
                  src={getProfileImageUrlOrPlaceholder({
                    path: group?.ownerUserProfile?.profileImagePath,
                  })}
                  alt={group?.ownerUserProfile?.fullName || ''}
                />
              </div>
            </div>
            <div className="hidden w-full justify-between pl-6 pt-[3.25rem] lg:flex">
              <div>
                <h1 className="typography-product-heading">{group?.title}</h1>
                <p className="mt-2 text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  {group?.headline}
                </p>
                {!!group?.city?.name && (
                  <div className="mt-1 flex items-center text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                    <Location className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
                    {group.city.name}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => {
                    openModalInvite();

                    if (navigator.share) {
                      navigator
                        .share({
                          title: `${group?.title} on Bounce`,
                          text: `Join ${group?.title} on Bounce, the pickleball app.`,
                          url: shareUrl,
                        })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing:', error));
                    }
                  }}
                  className="button-rounded-inline-primary flex items-center justify-center px-10 py-3"
                >
                  <Share className="mr-1.5 h-[1.125rem] w-[1.125rem]" />{' '}
                  <span className="text-base font-medium">Invite</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="max-w- w-full shrink-0 lg:max-w-[296px] lg:pt-4">
              <div className="px-4 lg:pl-6">
                <h1 className="mt-2 text-center text-2xl font-bold leading-7 lg:hidden">
                  {group?.title}
                </h1>
                <p className="mt-2 text-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:hidden">
                  {group?.headline}
                </p>
                {!!group?.ownerUserProfile?.fullName && (
                  <div className="mt-2 flex items-center justify-center text-center lg:mt-0 lg:justify-start lg:text-left">
                    <ChampionBadge className="mr-1 h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />{' '}
                    <span className="text-base font-semibold">
                      {group?.ownerUserProfile?.fullName}
                    </span>{' '}
                    <Link
                      href={`mailto:${group?.contactEmail || ''}?bcc=team@bounce.game`}
                      isExternal
                      className="button-background-bold ml-2 rounded-3xl px-4 py-1 text-xs font-medium"
                    >
                      Contact
                    </Link>
                  </div>
                )}
                {!!group?.city?.name && (
                  <div className="mt-2 flex items-center justify-center text-center text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:hidden">
                    <Location className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
                    {group.city.name}
                  </div>
                )}
                <div className="mt-4 flex w-full items-center justify-center space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
                  <div className="w-1/2 lg:w-full">
                    <ButtonLink href={getMyGroupMembersPageUrl(group?.id || '')}>
                      <GroupIcon className="mr-1.5 h-4" />{' '}
                      {pluralize({
                        count: group?.membersAggregate?.aggregate?.count || 0,
                        singular: 'Player',
                        plural: 'Players',
                      })}
                    </ButtonLink>
                  </div>
                  <div className="w-1/2 lg:w-full">
                    <ButtonLink href={getMyGroupVenuesPageUrl(group?.id || '')}>
                      <CourtFlatIcon className="mr-1.5 h-4" />{' '}
                      {pluralize({
                        count: group?.venuesAggregate?.aggregate?.count || 0,
                        singular: 'Court',
                        plural: 'Courts',
                      })}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pt-8 lg:ml-20 lg:max-w-xl lg:pt-0">
              <Sticky wrapperClassName="block lg:hidden" topOffset={-4}>
                <div className="flex items-center bg-color-bg-lightmode-primary px-4 dark:bg-color-bg-darkmode-primary">
                  <div className="flex w-full items-center border-y border-color-border-input-lightmode py-4 dark:border-color-border-input-darkmode lg:mt-0 lg:border-t-0 lg:pt-0">
                    <div className="shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                      />
                    </div>
                    <button
                      onClick={() => openModalCreateThread()}
                      className="relative mx-2 h-[42px] max-h-20 w-full grow resize-none rounded-3xl border-none bg-color-bg-input-lightmode-primary px-3.5 py-1 text-left text-base text-color-text-lightmode-tertiary disabled:opacity-60 dark:bg-color-bg-input-darkmode-primary dark:text-color-text-darkmode-tertiary"
                    >
                      <span>Create a post</span>
                      <span className="absolute bottom-0 right-2 top-0 my-auto flex items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert">
                          <Send className="h-3.5 w-3.5" />
                        </div>
                      </span>
                    </button>
                    <button className="shrink-0" onClick={() => openModalCreateThread()}>
                      <Photograph className="h-6 w-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
                    </button>
                  </div>
                </div>
              </Sticky>
              <Sticky wrapperClassName="hidden lg:block" topOffset={-4}>
                <div className="flex items-center bg-color-bg-lightmode-primary px-4 pt-4 dark:bg-color-bg-darkmode-primary">
                  <div className="flex w-full items-center border-y border-color-border-input-lightmode py-4 dark:border-color-border-input-darkmode lg:mt-0 lg:border-t-0 lg:pt-0">
                    <div className="shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                      />
                    </div>
                    <button
                      onClick={() => openModalCreateThread()}
                      className="relative mx-2 h-[42px] max-h-20 w-full grow resize-none rounded-3xl border-none bg-color-bg-input-lightmode-primary px-3.5 py-1 text-left text-base text-color-text-lightmode-tertiary disabled:opacity-60 dark:bg-color-bg-input-darkmode-primary dark:text-color-text-darkmode-tertiary"
                    >
                      <span>Create a post</span>
                      <span className="absolute bottom-0 right-2 top-0 my-auto flex items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert">
                          <Send className="h-3.5 w-3.5" />
                        </div>
                      </span>
                    </button>
                    <button className="shrink-0" onClick={() => openModalCreateThread()}>
                      <Photograph className="h-6 w-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
                    </button>
                  </div>
                </div>
              </Sticky>
              <div className="mt-6 space-y-10 px-4 lg:mt-8" ref={scrollBodyRef}>
                {group?.threads?.map((thread) => {
                  const rootComment = thread?.comments?.[0];
                  const threadUrl = getMyGroupThreadPageUrl({
                    groupId: group.id,
                    threadId: thread.id,
                  });
                  const userVote = rootComment?.votes?.[0];
                  const isUserUpvoted = userVote?.vote === CommentVoteEnum.Positive;

                  if (!rootComment) {
                    return null;
                  }

                  return (
                    <Comment
                      key={rootComment.id}
                      id={rootComment.id}
                      type="group"
                      commentLink={threadUrl}
                      content={rootComment.content}
                      files={rootComment.files.map((file) =>
                        getImageUrl({ url: file.url, path: file.path }),
                      )}
                      timestamp={rootComment.createdAt}
                      senderName={rootComment.userProfile?.fullName}
                      senderUsername={rootComment.userProfile?.username}
                      senderProfileImageUrl={getProfileImageUrlOrPlaceholder({
                        path: rootComment?.userProfile?.profileImagePath,
                      })}
                      actions={
                        <div className="mt-4 flex items-center justify-between border-t border-color-border-input-lightmode pt-2 text-sm font-medium leading-4 dark:border-color-border-input-darkmode">
                          <button
                            onClick={async () => {
                              if (!userId || !groupMembership || !group) {
                                return;
                              }

                              const variables = {
                                groupThreadCommentId: rootComment.id,
                                userId: userId,
                                vote: isUserUpvoted
                                  ? CommentVoteEnum.None
                                  : CommentVoteEnum.Positive,
                              };
                              await upsertGroupThreadVoteMutation({
                                variables,
                                optimisticResponse: {
                                  __typename: 'mutation_root',
                                  insertGroupCommentVotesOne: {
                                    __typename: 'GroupCommentVotes',
                                    ...variables,
                                    id: userVote?.id || '',
                                  },
                                },
                              });
                              await getGroupByIdLazyQuery({
                                fetchPolicy: 'network-only',
                                variables: {
                                  id: groupMembership.groupId,
                                  userId: userId,
                                  // userId: userId || uuid(), // NOTE: In case it's anonymous, let it run?
                                },
                              });
                            }}
                            className={classNames(
                              'flex items-center rounded-2xl px-2 py-1',
                              isUserUpvoted && 'bg-brand-fire-50 text-brand-fire-500',
                            )}
                          >
                            <ThumbUp className="mr-1 h-4 w-4" />{' '}
                            {rootComment?.votesAggregate?.aggregate?.count
                              ? rootComment?.votesAggregate?.aggregate?.count
                              : ''}
                          </button>
                          <Link href={threadUrl} className="py-2">
                            {pluralize({
                              count: Math.max(
                                (thread?.commentsAggregate?.aggregate?.count || 0) -
                                  ORIGINAl_COMMENT,
                                0,
                              ),
                              singular: 'Comment',
                              plural: 'Comments',
                            })}
                          </Link>
                          <Link href={threadUrl} className="flex items-center py-2">
                            <ChatBubble className="mr-1 h-4 w-4" /> Add comment
                          </Link>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <TabBar />
      </TabPageScrollPage>
      <ModalInvite
        title="Invite to Group"
        qrCodeString={shareUrl}
        isOpen={isModalInviteOpen}
        closeModal={closeModalInvite}
        openModal={openModalInvite}
      />
      <ModalCreateThread
        isOpen={isModaCreateThreadOpen}
        closeModal={closeModalCreateThread}
        userId={userId}
        groupId={group?.id}
        isGroupMember={!!groupMembership}
        isGroupLoaded={!!group}
        handleCommentSubmit={async () => {
          await getGroupByIdLazyQuery({
            fetchPolicy: 'network-only',
            variables: {
              id: groupMembership?.groupId,
              userId: userId,
            },
          });
        }}
      />
    </>
  );
}
