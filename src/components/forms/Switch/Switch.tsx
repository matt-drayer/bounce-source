import * as React from 'react';
import { Switch } from '@headlessui/react';
import classNames from 'styles/utils/classNames';

interface Props {
  label?: string;
  labelLeft?: React.ReactNode;
  labelRight?: React.ReactNode;
  ariaDescription?: string;
  isActive: boolean;
  toggleIsActive: () => void;
  shouldUseIcon?: boolean;
}

export default function SwitchWrapper({
  label = '',
  labelLeft,
  labelRight,
  isActive,
  toggleIsActive,
  ariaDescription,
  shouldUseIcon,
}: Props) {
  return (
    <Switch.Group as="div" className="flex max-w-sm items-center justify-between lg:ml-auto">
      {!!label && (
        <Switch.Label
          as="span"
          className="cursor-pointer text-base text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
        >
          {label}
        </Switch.Label>
      )}
      {!!labelLeft && (
        <Switch.Label as="span" className="cursor-pointer">
          {labelLeft}
        </Switch.Label>
      )}
      <Switch
        checked={isActive}
        onChange={toggleIsActive}
        className={classNames(
          isActive ? 'bg-color-button-brand-primary' : 'bg-gray-200',
          'focus-on-tab relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        )}
      >
        {!!ariaDescription && <span className="sr-only">{ariaDescription}</span>}
        <span
          className={classNames(
            isActive ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-color-bg-lightmode-primary shadow ring-0 transition duration-200 ease-in-out dark:bg-color-bg-darkmode-primary',
          )}
        >
          {shouldUseIcon && (
            <>
              <span
                className={classNames(
                  isActive ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                )}
                aria-hidden="true"
              >
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  isActive ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                )}
                aria-hidden="true"
              >
                <svg
                  className="w- h-3 text-color-button-brand-primary"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </>
          )}
        </span>
      </Switch>
      {!!labelRight && (
        <Switch.Label as="span" className="cursor-pointer">
          {labelRight}
        </Switch.Label>
      )}
    </Switch.Group>
  );
}
