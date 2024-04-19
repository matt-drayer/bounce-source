import * as React from 'react';
import classNames from 'styles/utils/classNames';

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

const ButtonSelector: React.FC<Props> = ({ children, onClick, isActive }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'h-full w-full rounded-md border transition-shadow',
        isActive
          ? 'border-color-tab-active bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
          : 'border-color-border-card-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-tertiary shadow-none dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-tertiary',
      )}
    >
      {children}
    </button>
  );
};

export default ButtonSelector;
