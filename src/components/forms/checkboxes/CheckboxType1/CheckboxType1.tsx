import * as React from 'react';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import classNames from 'styles/utils/classNames';

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  labelClassName?: string;
};

const CheckboxType1 = ({ name, label, control, labelClassName = '' }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, name, value } }) => (
        <label htmlFor={name} className={labelClassName}>
          <input
            id={name}
            value={value}
            type="checkbox"
            checked={value}
            name={name}
            onChange={() => onChange(!value)}
            className={classNames(
              'h-5 w-5 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:text-color-bg-darkmode-invert dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
            )}
          />
          <span
            className={classNames(
              'typography-product-body ml-3  text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
            )}
          >
            {label}
          </span>
        </label>
      )}
    />
  );
};

export default CheckboxType1;
