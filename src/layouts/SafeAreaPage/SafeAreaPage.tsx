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

const SafeAreaPage: React.FC<Props> = ({
  children,
  isHideSidebar,
  isShowTopNav,
  isIgnoreMobileTabs,
  handleSignupSuccess,
  shouldHideNavigation = false,
}) => {
  return (
    <div className="safearea-pad-y flex h-full grow flex-col bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
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
          'flex h-full grow flex-col lg:pb-0',
          !isIgnoreMobileTabs && 'pb-tabs',
          !isHideSidebar && 'lg:pl-sidebar',
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SafeAreaPage;
