import * as React from 'react';
import classNames from 'styles/utils/classNames';

interface Props {
  isActive: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const TabButton: React.FC<Props> = ({ isActive, handleClick, children }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames(
        'flex h-9 w-1/2 items-start justify-center rounded-none border-b-2 text-sm font-medium leading-5',
        isActive
          ? 'border-color-text-lightmode-primary text-color-text-lightmode-primary dark:border-color-text-darkmode-primary dark:text-color-text-darkmode-primary'
          : 'border-transparent text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
      )}
    >
      {children}
    </button>
  );
};

export default TabButton;
