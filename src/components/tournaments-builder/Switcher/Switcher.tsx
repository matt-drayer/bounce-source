import React from 'react';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import Switch from 'components/forms/Switch';

type Props = {
  label?: string;
  name: string;
  errors: FieldErrors<any>;
  control: Control<any>;
};

const Switcher = ({ label, errors, control, name }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { value, onChange } }) => (
        <div className="flex [&>div]:mr-4 [&>div]:lg:ml-0">
          <Switch
            isActive={value}
            toggleIsActive={() => {
              onChange(!value);
            }}
          />
          {label && (
            <span className="font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              {label}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default Switcher;
