import React from 'react';
import { Popover } from '@headlessui/react';
import ArrowUp from 'svg/ChevronDown';
import classNames from 'styles/utils/classNames';

interface DropdownProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Dropdown({ label, className, children }: DropdownProps) {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="relative z-10 shrink-0">
            <span
              className={classNames(
                'typography-product-body text-color-text-lightmode-secondary hover:text-color-text-lightmode-primary dark:text-color-text-darkmode-secondary hover:dark:text-color-text-darkmode-primary',
                'flex items-center',
              )}
            >
              <span className="mr-ds-sm shrink-0 flex-nowrap">{label}</span>
              <ArrowUp
                className={classNames(
                  'h-4 w-4 shrink-0 transition-transform',
                  open && 'rotate-180',
                )}
              />
            </span>
          </Popover.Button>
          <Popover.Panel
            className={classNames(
              'absolute z-10 -ml-4 mt-2 rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-primary p-ds-xl px-3 py-2 shadow-popover dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary',
              !!className && className,
            )}
          >
            {children}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
