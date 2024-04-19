import React from 'react';
import { useRouter } from 'next/router';
import ChevronLeftIcon from 'svg/ChevronLeft';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';
import { Props } from './props';

export default function PageTitle({
  title,
  backUrl,
  isPop,
  right,
  isBackdropBlur,
  isAutoHeightDesktop,
  bottom,
}: Props) {
  const router = useRouter();
  let left = <div>&nbsp;</div>;

  if (backUrl) {
    left = (
      <Link href={backUrl}>
        <ChevronLeftIcon className="h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:h-6 lg:w-6" />
      </Link>
    );
  } else if (isPop) {
    // button that pops
    left = (
      <button
        className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
        onClick={() => router.back()}
        type="button"
      >
        <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>
    );
  }

  return (
    <>
      <div
        className={classNames(
          'relative z-10 flex h-mobile-page-title items-center bg-color-bg-lightmode-primary px-6 dark:bg-color-bg-darkmode-primary',
          isAutoHeightDesktop ? 'lg:h-auto' : 'lg:h-desktop-page-title',
          isBackdropBlur && 'bg-opacity-80 backdrop-blur-sm',
        )}
      >
        {!!left && (
          <div className="absolute left-0 top-0 flex h-full items-center pl-4 lg:static lg:mr-4 lg:pl-0">
            {left}
          </div>
        )}
        <h1
          className={classNames(
            'w-full text-lg font-bold leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl',
            !!left && 'text-center lg:text-left',
          )}
        >
          {title}
        </h1>
        {!!right && <div className="absolute right-0 flex h-full items-center pr-4">{right}</div>}
      </div>
      {bottom}
    </>
  );
}
