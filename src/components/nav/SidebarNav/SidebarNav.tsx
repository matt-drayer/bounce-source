import React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  COACH_SIDEBAR,
  HOME_PAGE,
  MY_PROFILE_PAGE,
  PLAYER_SIDEBAR,
  PLAYER_WITH_COACH_SIDEBAR,
  ROOT_PAGE,
} from 'constants/pages';
import { CoachStatusEnum } from 'types/generated/client';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAuthModals } from 'hooks/useAuthModals';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Logo from 'svg/LogoNav';
import Link from 'components/Link';
import TransitionFadeIn from 'components/TransitionFadeIn';
import classNames from 'styles/utils/classNames';
import SidebarItem from './SidebarItem';

interface Props {
  isTopNavHidden?: boolean;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
}

interface SidebarItemParams {
  coachStatus?: CoachStatusEnum | null;
  followingCoachCount?: number | null;
}

const getSidebarItems = ({ coachStatus, followingCoachCount }: SidebarItemParams) => {
  if (!coachStatus) {
    return [];
  }

  if (coachStatus === CoachStatusEnum.Active) {
    return COACH_SIDEBAR;
  } else {
    const hasCoaches = !!followingCoachCount;
    return hasCoaches ? PLAYER_WITH_COACH_SIDEBAR : PLAYER_SIDEBAR;
  }
};

const SidebarNav: React.FC<Props> = ({ isTopNavHidden, handleSignupSuccess }) => {
  const viewer = useViewer();
  const router = useRouter();
  const { ModalLogin, ModalSignup, openSignupModal, openLoginModal } = useAuthModals();
  const { user, loading, called } = useGetCurrentUser();
  const sidebarItems = getSidebarItems({
    coachStatus: user?.coachStatus,
    followingCoachCount: user?.followingCoachesAggregate?.aggregate?.count,
  });
  const isViewerLoaded = viewer.status !== AuthStatus.Loading;
  const isAnon = viewer.status === AuthStatus.Anonymous;
  const isUser = viewer.status === AuthStatus.User;
  const isAnonLoaded = isViewerLoaded;
  const isUserLoaded = isViewerLoaded && !loading && called;
  const isShowing = (isAnon && isAnonLoaded) || (isUser && isUserLoaded);

  return (
    <>
      <div
        className={classNames(
          'fixed bottom-0 left-0 z-30 hidden w-sidebar border-r border-color-border-input-lightmode bg-color-bg-lightmode-primary px-4 py-4 dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary lg:block',
          isTopNavHidden ? 'h-screen' : 'h-[calc(100vh-theme(height.topnav))]',
        )}
      >
        <div className="flex h-full flex-col">
          {isTopNavHidden && (
            <div className="mb-6 px-4 pt-2">
              <Link className="block" href={viewer.isUserSession ? HOME_PAGE : ROOT_PAGE}>
                <div>
                  <Logo className="h-[30px]" />
                </div>
              </Link>
            </div>
          )}
          <TransitionFadeIn isShowing={isShowing} className="flex h-full flex-col">
            {isAnon ? (
              <div className="flex h-full flex-col space-y-3">
                <button onClick={() => openSignupModal(true)} className="button-rounded-full-brand">
                  Sign up
                </button>
                <button
                  onClick={() => openLoginModal(true)}
                  className="button-rounded-full-primary-inverted"
                >
                  Log in
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between">
                <div className="flex h-full flex-col space-y-2">
                  {sidebarItems.map(({ text, href, Icon }, index) => {
                    const isActive = href === router.asPath;
                    return (
                      <SidebarItem
                        key={text}
                        text={text}
                        href={href}
                        icon={<Icon className="w-full" />}
                        isActive={isActive}
                      />
                    );
                  })}
                </div>
                <div>
                  <Link
                    href={MY_PROFILE_PAGE}
                    className={classNames(
                      'flex items-center rounded-md px-4 py-2 transition-colors hover:bg-color-bg-lightmode-tertiary dark:hover:bg-color-bg-darkmode-tertiary',
                      router.asPath === MY_PROFILE_PAGE &&
                        'bg-color-bg-lightmode-tertiary hover:bg-color-bg-lightmode-tertiary dark:bg-color-bg-darkmode-tertiary dark:hover:bg-color-bg-darkmode-tertiary',
                    )}
                  >
                    <span className="h-10 w-10">
                      <img
                        src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </span>
                    <div className="ml-3.5">
                      <div
                        className={classNames(
                          'text-sm font-medium',
                          router.asPath === MY_PROFILE_PAGE
                            ? 'text-color-text-brand'
                            : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                        )}
                      >
                        My Profile
                      </div>
                      {/* {user?.username && (
                        <div className="text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                          @{user.username}
                        </div>
                      )} */}
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </TransitionFadeIn>
        </div>
      </div>
      <ModalSignup handleSignupSuccess={handleSignupSuccess} isShowLoginLink />
      <ModalLogin isShowSignupLink />
    </>
  );
};

export default SidebarNav;
