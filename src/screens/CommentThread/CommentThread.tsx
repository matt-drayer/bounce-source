import * as React from 'react';
import { useRouter } from 'next/router';
import { MY_GROUPS } from 'constants/pages';
import {
  CommentVoteEnum,
  useGetGroupThreadByIdLazyQuery,
  useInsertGroupThreadCommentMutation,
  useUpsertGroupThreadVoteMutation,
} from 'types/generated/client';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { pluralize } from 'utils/shared/pluralize';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAutosizeTextArea } from 'hooks/useAutosizeTextArea';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Send from 'svg/Send';
import ThumbUp from 'svg/ThumbUp';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Comment from 'components/Comment';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const IS_HIDE_SIDEBAR = false;
const DEFAULT_COMMENT_HEIGHT_PX = 42;
const ORIGINAl_COMMENT = 1;

export default function CommentThread() {
  const { isUserSession, userId } = useViewer();
  const { user } = useGetCurrentUser();
  const router = useRouter();
  const [getGroupThreadByIdLazyQuery, { data, loading }] = useGetGroupThreadByIdLazyQuery();
  const [insertGroupThreadCommentMutation, { loading: isInsertGroupThreadCommentMutationLoading }] =
    useInsertGroupThreadCommentMutation();
  const [upsertGroupThreadVoteMutation, { loading: upsertGroupThreadVoteMutationLoading }] =
    useUpsertGroupThreadVoteMutation();
  const { textAreaRef } = useAutosizeTextArea({ initialHeightPx: DEFAULT_COMMENT_HEIGHT_PX });
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const [commentText, setCommentText] = React.useState('');
  const thread = data?.groupThreadsByPk;
  const comments = thread?.comments || [];
  const threadId = router.query.threadId;

  React.useEffect(() => {
    if (userId && router.query.threadId && typeof router.query.threadId === 'string') {
      getGroupThreadByIdLazyQuery({
        variables: {
          id: router.query.threadId,
          userId,
        },
      });
    }
  }, [router.isReady, userId]);

  return (
    <>
      <Head noIndex title="Thread" />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle
                title="Thread"
                isBackdropBlur
                isHideSidebar={IS_HIDE_SIDEBAR}
                backUrl={MY_GROUPS}
              />
            </div>
            <main className="mx-auto w-full max-w-2xl space-y-6 px-4 pb-12 pt-4 lg:pb-24">
              {comments.map((comment) => {
                /**
                 * @note should we .find the root comment and then .filter it out?
                 */
                const isRootComment = comment?.isOriginalThreadComment;
                const userVote = comment?.votes?.[0];
                const isUserUpvoted = userVote?.vote === CommentVoteEnum.Positive;

                return (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    type="group"
                    files={comment.files.map((file) =>
                      getImageUrl({ url: file.url, path: file.path }),
                    )}
                    content={comment.content}
                    senderName={comment?.userProfile?.fullName}
                    senderUsername={comment?.userProfile?.username}
                    senderProfileImageUrl={getProfileImageUrlOrPlaceholder({
                      path: comment?.userProfile?.profileImagePath,
                    })}
                    timestamp={comment.createdAt}
                    actions={
                      isRootComment ? (
                        <div className="mt-2 flex items-center justify-between border-b border-color-border-input-lightmode pb-2 text-sm font-medium leading-4 dark:border-color-border-input-darkmode">
                          <button
                            onClick={async () => {
                              if (!userId) {
                                return;
                              }

                              const variables = {
                                groupThreadCommentId: comment.id,
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
                              await getGroupThreadByIdLazyQuery({
                                fetchPolicy: 'network-only',
                                variables: {
                                  id: router.query.threadId,
                                  userId,
                                },
                              });
                            }}
                            className={classNames(
                              'flex items-center rounded-2xl px-2 py-1',
                              isUserUpvoted && 'bg-brand-fire-50 text-color-text-brand',
                            )}
                          >
                            <ThumbUp className="mr-1 h-4 w-4" />{' '}
                            {comment?.votesAggregate?.aggregate?.count
                              ? comment?.votesAggregate?.aggregate?.count
                              : ''}
                          </button>
                          <div className="py-2">
                            {pluralize({
                              count: Math.max(
                                (thread?.comments?.length || 0) - ORIGINAl_COMMENT,
                                0,
                              ),
                              singular: 'Comment',
                              plural: 'Comments',
                            })}
                          </div>
                        </div>
                      ) : null
                    }
                  />
                );
              })}
            </main>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 z-10 flex w-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary dark:bg-color-bg-darkmode-primary lg:pl-sidebar">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              await insertGroupThreadCommentMutation({
                variables: {
                  groupThreadId: threadId as string,
                  content: commentText,
                  userId: userId,
                  groupCommentId: null,
                  groupRootCommentId: null,
                },
              });
              setCommentText('');
              getGroupThreadByIdLazyQuery({
                fetchPolicy: 'network-only',
                variables: {
                  id: router.query.threadId,
                  userId,
                },
              }).then(() => {
                setTimeout(() => {
                  scrollBodyRef.current?.scrollTo({
                    top: scrollBodyRef.current?.scrollHeight,
                    behavior: 'smooth',
                  });
                }, 200);
              });
            }}
            className="flex w-full items-center py-2 shadow-tabs"
          >
            <div className="mx-auto flex w-full max-w-2xl items-center px-4">
              <img
                className="h-8 w-8 rounded-full"
                src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
              />
              <textarea
                ref={textAreaRef}
                disabled={isInsertGroupThreadCommentMutationLoading}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mx-2 h-[42px] max-h-20 w-full grow resize-none rounded-3xl border-none bg-color-bg-input-lightmode-primary px-3.5 py-[9px] text-base disabled:opacity-60 dark:bg-color-bg-input-darkmode-primary"
                placeholder="Add a comment"
              />
              <button
                disabled={isInsertGroupThreadCommentMutationLoading}
                type="submit"
                className="disabled:opacity-60"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </SafeAreaPage>
    </>
  );
}
