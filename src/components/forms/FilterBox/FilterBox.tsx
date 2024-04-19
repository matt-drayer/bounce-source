import React from 'react';
import styled from 'styled-components';
import classNames from 'styles/utils/classNames';

interface Props {
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

export default function FilterBox({ label, onClick, isSelected }: Props) {
  return (
    <button
      type="button"
      className={classNames(
        'typography-product-chips-filters flex w-full items-center justify-center rounded-md px-1 py-3 text-center',
        isSelected
          ? 'bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert'
          : 'bg-color-bg-lightmode-secondary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-secondary',
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
