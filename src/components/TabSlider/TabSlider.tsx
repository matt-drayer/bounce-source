import React from 'react';
import classNames from 'styles/utils/classNames';

interface Tab {
  name: string;
  handleClick: () => void;
  isActive: boolean;
}

interface Props {
  activeIndex: number;
  tabs: Tab[];
}

interface TabButtonProps extends Tab {
  isActive: boolean;
  tabCount: number;
}

const TabButton = ({ name, handleClick, tabCount, isActive }: TabButtonProps) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className={classNames(
        'typography-product-button-label-small relative h-full w-1/2',
        tabCount === 1 && 'w-full',
        tabCount === 2 && 'w-1/2',
        tabCount === 3 && 'w-1/3',
        tabCount === 4 && 'w-1/4',
        isActive
          ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
          : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
      )}
    >
      {name}
    </button>
  );
};

export default function TabSlider({ tabs, activeIndex }: Props) {
  return (
    <div className="flex h-10 w-full items-center rounded-full bg-color-bg-lightmode-primary bg-opacity-40 p-1 text-center text-sm dark:bg-color-bg-darkmode-primary">
      <div className="relative flex h-full w-full items-center">
        <div
          className={classNames(
            'absolute left-0 h-full rounded-full bg-color-bg-lightmode-primary font-medium shadow-tab-slider transition-transform dark:bg-color-bg-darkmode-primary',
            activeIndex === 0 && 'translate-x-0',
            activeIndex === 1 && 'translate-x-full',
            activeIndex === 2 && 'translate-x-[calc(100%*2)]',
            activeIndex === 3 && 'translate-x-[calc(100%*3)]',
            activeIndex === 4 && 'translate-x-[calc(100%*4)]',
            tabs.length === 1 && 'w-full',
            tabs.length === 2 && 'w-1/2',
            tabs.length === 3 && 'w-1/3',
            tabs.length === 4 && 'w-1/4',
          )}
        >
          &nbsp;
        </div>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.name}
            {...tab}
            tabCount={tabs.length}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
