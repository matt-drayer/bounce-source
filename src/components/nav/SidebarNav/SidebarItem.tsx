import React from 'react';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';

interface Props {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const SidebarItem: React.FC<Props> = ({ href, icon, text, isActive }) => {
  return (
    <Link
      href={href}
      className={classNames(
        'flex items-center rounded-md px-4 py-2 transition-colors hover:bg-color-bg-lightmode-tertiary dark:hover:bg-color-bg-darkmode-tertiary',
        isActive &&
          'bg-color-bg-lightmode-tertiary hover:bg-color-bg-lightmode-tertiary dark:bg-color-bg-darkmode-tertiary dark:hover:bg-color-bg-darkmode-tertiary',
      )}
    >
      <span
        className={classNames(
          'w-6',
          isActive
            ? 'text-color-text-brand'
            : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
        )}
      >
        {icon}
      </span>
      <span
        className={classNames(
          'ml-3.5',
          isActive
            ? 'font-medium text-color-text-brand'
            : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
        )}
      >
        {text}
      </span>
    </Link>
  );
};

export default SidebarItem;
