import * as React from 'react';
import classNames from 'styles/utils/classNames';
import PageTitle from './PageTitle';
import { Props } from './props';

export default function FixedPageTitle(props: Props) {
  return (
    <>
      <div
        className={classNames(
          'fixed left-0 top-0 z-20 w-full',
          !props.isHideSidebar && 'lg:pl-sidebar',
          props.isShowTopNav && 'lg:pt-topnav',
        )}
      >
        <div
          className={classNames(
            'safearea-spacer-top w-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
            props.isBackdropBlur && 'bg-opacity-80 backdrop-blur-sm',
          )}
        ></div>
        <PageTitle {...props} />
      </div>
      <div className="h-mobile-page-title w-full shrink-0 lg:h-desktop-page-title">&nbsp;</div>
    </>
  );
}
