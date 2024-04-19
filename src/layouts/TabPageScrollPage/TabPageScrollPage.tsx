import React from 'react';
import SidebarNav from 'components/nav/SidebarNav';
import TabBar from 'components/nav/TabBar';
import TopNav from 'components/nav/TopNav';
import classNames from 'styles/utils/classNames';

interface Props {
  children: React.ReactNode;
  ignoreSafeTop?: boolean;
  isShowTopNav?: boolean;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
  shouldHideNavigation?: boolean;
}

const TabPageScrollPage = ({
  children,
  isShowTopNav,
  ignoreSafeTop = false,
  handleSignupSuccess,
  shouldHideNavigation = false,
}: Props) => {
  return (
    <div
      className={classNames(
        'safearea-pad-bot flex h-full grow flex-col bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
        !ignoreSafeTop && 'safearea-pad-top',
      )}
    >
      {isShowTopNav && (
        <TopNav
          shouldHideNavigation={shouldHideNavigation}
          handleSignupSuccess={handleSignupSuccess}
        />
      )}
      <SidebarNav isTopNavHidden={!isShowTopNav} handleSignupSuccess={handleSignupSuccess} />
      <div className="flex h-full grow flex-col pb-tabs lg:pb-0 lg:pl-sidebar">{children}</div>
      <TabBar handleSignupSuccess={handleSignupSuccess} />
    </div>
  );
};

export default TabPageScrollPage;
