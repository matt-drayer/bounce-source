import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  ABOUT_PAGE,
  ACTIVE_COUNTRIES,
  BLOG_PAGE,
  COURT_FINDER_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  MY_PROFILE_PAGE,
  ROOT_PAGE,
  SIGNUP_CODE_PAGE,
  getCountryCourtsPageUrl,
} from 'constants/pages';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAuthModals } from 'hooks/useAuthModals';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import Logo from 'svg/LogoNav';
import { Button, ButtonLink, ButtonLinkText, ButtonText } from 'components/Button';
import Link from 'components/Link';
import TransitionFadeIn from 'components/TransitionFadeIn';
import classNames from 'styles/utils/classNames';

interface Props {
  shouldShowAdditionalLinks?: boolean;
  shouldHideNavigation: boolean;
  shouldShowMobile?: boolean;
  shouldLinkToAuthPage?: boolean;
  shouldShowStartAction?: boolean;
  isBlur?: boolean;
  isInvert?: boolean;
  isTransparent?: boolean;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
}

const NavLink = ({
  href,
  children,
  isActive,
  isInvert,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  isInvert?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        'group relative flex flex-col items-center justify-center rounded-full px-ds-lg py-2 transition-colors',
        isInvert
          ? 'hover:bg-color-bg-darkmode-secondary hover:dark:bg-color-bg-lightmode-secondary'
          : 'hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary',
        isInvert
          ? ''
          : isActive
          ? 'typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
          : 'typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
        isInvert
          ? isActive
            ? 'typography-product-subheading text-color-text-lightmode-invert dark:text-color-text-darkmode-invert'
            : 'typography-product-body text-color-text-darkmode-secondary dark:text-color-text-lightmode-secondary'
          : '',
      )}
    >
      {children}
      {isActive && (
        <span
          className={classNames(
            'absolute bottom-0.5 h-[2px] w-1/2 rounded-full group-hover:hidden',
            isInvert
              ? 'bg-color-text-lightmode-invert dark:bg-color-text-darkmode-invert'
              : 'bg-color-text-lightmode-primary dark:bg-color-text-darkmode-primary',
          )}
        >
          &nbsp;
        </span>
      )}
    </Link>
  );
};

const TopNav = ({
  shouldShowAdditionalLinks,
  shouldShowMobile,
  shouldHideNavigation,
  shouldLinkToAuthPage,
  shouldShowStartAction,
  isBlur,
  isInvert,
  isTransparent,
  handleSignupSuccess,
}: Props) => {
  const viewer = useViewer();
  const router = useRouter();
  const { ModalLogin, ModalSignup, openSignupModal, openLoginModal } = useAuthModals();
  const { user, loading, called } = useGetCurrentUser();
  const isViewerLoaded = viewer.status !== AuthStatus.Loading;
  const isAnon = viewer.status === AuthStatus.Anonymous;
  const isUser = viewer.status === AuthStatus.User;
  const isAnonLoaded = isViewerLoaded;
  const isUserLoaded = isViewerLoaded && !loading && called;
  const isShowing = (isAnon && isAnonLoaded) || (isUser && isUserLoaded);

  return (
    <>
      <div className={classNames('block w-full')}>
        <div
          className={classNames(
            'fixed left-0 top-0 z-20 h-topnav w-full',
            isBlur && 'bg-opacity-80 backdrop-blur-md',
            isTransparent
              ? 'bg-transparent'
              : isInvert
              ? 'bg-color-bg-lightmode-invert dark:bg-color-bg-darkmode-invert'
              : 'border-b border-color-border-input-lightmode bg-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary',
          )}
        >
          <div className="flex h-full w-full items-center justify-between">
            <div className="relative z-10 flex h-full items-center pl-4 sm:pl-8">
              <Link
                href={isUser ? HOME_PAGE : ROOT_PAGE}
                className="inline-block"
                aria-label="Home"
              >
                <div className="flex h-full items-center">
                  <Logo className="h-6" />
                </div>
              </Link>
            </div>
            <div className="absolute left-0 right-0 mx-auto flex h-full w-full items-center justify-center">
              {!shouldHideNavigation && (
                <div className="hidden h-full items-center lg:flex">
                  <NavLink
                    isActive={router.pathname === ROOT_PAGE}
                    href={ROOT_PAGE}
                    isInvert={isInvert}
                  >
                    Tournaments
                  </NavLink>
                  <NavLink
                    isActive={router.pathname.includes('/court')}
                    href={COURT_FINDER_PAGE}
                    isInvert={isInvert}
                  >
                    Court Finder
                  </NavLink>
                  {/* <NavLink
                    isActive={router.pathname === COURT_FINDER_PAGE}
                    href={COURT_FINDER_PAGE}
                    isInvert={isInvert}
                  >
                    Courts
                  </NavLink> */}
                </div>
              )}
            </div>
            <div className="relative z-10 flex h-full items-center pr-4 sm:pr-8">
              <TransitionFadeIn className="" isShowing={isShowing}>
                {isAnon ? (
                  <div className="flex h-full shrink-0 items-center space-x-2">
                    {shouldLinkToAuthPage ? (
                      <>
                        <ButtonLinkText
                          href={LOGIN_PAGE}
                          size="md"
                          className={classNames(
                            'rounded-full px-4 py-2.5 font-medium transition-colors hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary',
                            isInvert
                              ? 'text-color-text-darkmode-secondary dark:text-color-text-lightmode-secondary'
                              : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                          )}
                        >
                          Log in
                        </ButtonLinkText>
                        <ButtonLink
                          href={SIGNUP_CODE_PAGE}
                          variant={isInvert ? 'inverted' : 'primary'}
                          size="sm"
                          isInline
                        >
                          Sign up
                        </ButtonLink>
                      </>
                    ) : (
                      <>
                        <ButtonText
                          onClick={() => openLoginModal(true)}
                          size="md"
                          className={classNames(
                            'rounded-full px-4 py-2.5 font-medium transition-colors hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary',
                            isInvert
                              ? 'text-color-text-darkmode-secondary dark:text-color-text-lightmode-secondary'
                              : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                          )}
                        >
                          Log in
                        </ButtonText>
                        <Button
                          onClick={() => openSignupModal(true)}
                          variant={isInvert ? 'inverted' : 'primary'}
                          size="sm"
                          isInline
                        >
                          Sign up
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full shrink-0 items-center">
                    {!!shouldShowStartAction && (
                      <ButtonLink
                        href={HOME_PAGE}
                        size="sm"
                        variant="brand"
                        isInline
                        className="ml-4 mr-4 inline"
                      >
                        Get started
                      </ButtonLink>
                    )}
                    <Link href={MY_PROFILE_PAGE} className="block shrink-0 rounded-full">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                      />
                    </Link>
                  </div>
                )}
              </TransitionFadeIn>
            </div>
          </div>
        </div>
        {!isTransparent && (
          <div
            className={classNames(
              'h-topnav w-full',
              isBlur &&
                !isInvert &&
                'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
              isBlur && isInvert && 'bg-color-bg-lightmode-invert dark:bg-color-bg-darkmode-invert',
            )}
          >
            &nbsp;
          </div>
        )}
      </div>
      <ModalSignup handleSignupSuccess={handleSignupSuccess} isShowLoginLink />
      <ModalLogin isShowSignupLink />
    </>
  );
};

export default TopNav;
