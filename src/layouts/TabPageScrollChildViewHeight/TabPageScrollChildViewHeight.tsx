import * as React from 'react';
import SidebarNav from 'components/nav/SidebarNav';
import TopNav from 'components/nav/TopNav';
import classNames from 'styles/utils/classNames';

interface Props {
  children: React.ReactNode;
  isHideSidebar?: boolean;
  isShowTopNav?: boolean;
  isIgnoreMobileTabs?: boolean;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
  shouldHideNavigation?: boolean;
}

const TabPageScrollChildViewHeight = ({
  children,
  isHideSidebar,
  isShowTopNav,
  handleSignupSuccess,
  shouldHideNavigation = false,
}: Props) => {
  return (
    <div className="safearea-pad-y flex h-screen grow flex-col overflow-hidden bg-color-bg-lightmode-primary pb-tabs dark:bg-color-bg-darkmode-primary">
      {isShowTopNav && (
        <TopNav
          shouldHideNavigation={shouldHideNavigation}
          handleSignupSuccess={handleSignupSuccess}
        />
      )}
      {!isHideSidebar && (
        <SidebarNav isTopNavHidden={!isShowTopNav} handleSignupSuccess={handleSignupSuccess} />
      )}
      <div
        className={classNames(
          'flex h-full grow flex-col overflow-hidden lg:pb-0',
          !isHideSidebar && 'lg:pl-sidebar',
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default TabPageScrollChildViewHeight;
