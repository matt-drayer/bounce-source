import * as React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'components/Link';

interface Props {
  href: string;
  hideIcon?: boolean;
  children?: React.ReactNode;
}

// NOTE: I had no idea what to name this thing
const LinkBoxButton: React.FC<Props> = ({ href, hideIcon, children }) => {
  return (
    <Link
      href={href}
      className="input-base-form flex w-full items-center justify-between py-2.5 pl-3.5 pr-4 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
    >
      <div>{children}</div>
      {!hideIcon && (
        <div>
          <ChevronRightIcon className="h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
        </div>
      )}
    </Link>
  );
};

export default LinkBoxButton;
