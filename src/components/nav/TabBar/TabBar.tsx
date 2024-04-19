import React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { COACH_TABS, PLAYER_TABS, PLAYER_WITH_COACH_TABS } from 'constants/pages';
import { CoachStatusEnum } from 'types/generated/client';
import { useAuthModals } from 'hooks/useAuthModals';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Link from 'components/Link';
import TransitionFadeIn from 'components/TransitionFadeIn';
import classNames from 'styles/utils/classNames';
import { ItemText } from './styles';

interface Props {
  aboveTabContent?: React.ReactNode;
  tabs?: {
    Icon: React.FC<{ className?: string }>;
    text: string;
    href: string;
  }[];
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
}

const TabBar: React.FC<Props> = ({ aboveTabContent, tabs = [], handleSignupSuccess }) => {
  const router = useRouter();
  const viewer = useViewer();
  const { ModalLogin, ModalSignup, openSignupModal, openLoginModal } = useAuthModals();
  const { user, loading, called } = useGetCurrentUser();
  const isViewerLoaded = viewer.status !== AuthStatus.Loading;
  const isAnon = viewer.status === AuthStatus.Anonymous;
  const isUser = viewer.status === AuthStatus.User;
  const isAnonLoaded = isViewerLoaded;
  const isUserLoaded = isViewerLoaded && !loading && called;
  const isShowing = (isAnon && isAnonLoaded) || (isUser && isUserLoaded);

  let activeTabs = tabs;

  if (!activeTabs || (activeTabs.length === 0 && !!user)) {
    if (user?.coachStatus === CoachStatusEnum.Active) {
      activeTabs = COACH_TABS;
    } else {
      const hasCoaches = !!user?.followingCoachesAggregate?.aggregate?.count;
      activeTabs = hasCoaches ? PLAYER_WITH_COACH_TABS : PLAYER_TABS;
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 z-20 w-screen lg:hidden">
        {aboveTabContent}
        <div className="w-full border-t border-color-border-input-lightmode bg-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
          <TransitionFadeIn className="flex h-full w-full items-center" isShowing={isShowing}>
            {isAnon ? (
              <div className="flex h-tabs w-full grow-0 items-center justify-around space-x-2 px-gutter-base">
                <div className="w-1/2">
                  <button
                    onClick={() => openLoginModal(true)}
                    className="button-rounded-inline-brand-inverted w-full"
                  >
                    Log in
                  </button>
                </div>
                <div className="w-1/2">
                  <button
                    onClick={() => openSignupModal(true)}
                    className="button-rounded-inline-primary w-full"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-tabs w-full grow-0 items-center justify-between">
                {activeTabs.map(({ text, href, Icon }) => {
                  const isActive = href === router.asPath;

                  return (
                    <Link
                      key={text}
                      href={href}
                      className={classNames(
                        `w-1/${activeTabs.length} h-full outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent dark:focus:ring-0 dark:focus:ring-offset-0 dark:focus:ring-offset-transparent`,
                      )}
                    >
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <Icon
                          className={classNames(
                            'h-5 w-5',
                            isActive
                              ? 'text-color-text-brand'
                              : 'text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon',
                          )}
                        />
                        <ItemText
                          className={classNames(
                            'typography-product-tabbar-mobile mt-1',
                            isActive
                              ? 'text-color-text-brand'
                              : 'text-color-text-lightmode-tertiary dark:text-color-text-lightmode-tertiary',
                          )}
                        >
                          {text}
                        </ItemText>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TransitionFadeIn>
          <div className="safearea-spacer-bot"></div>
        </div>
      </div>
      <ModalSignup handleSignupSuccess={handleSignupSuccess} isShowLoginLink />
      <ModalLogin isShowSignupLink />
    </>
  );
};

export default TabBar;
