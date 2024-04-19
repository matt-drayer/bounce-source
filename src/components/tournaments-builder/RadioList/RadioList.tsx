import * as React from 'react';
import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import classNames from 'styles/utils/classNames';

type Props = {
  errors: FieldErrors<any>;
  control: Control<any>;

  name: string;
  listHeader: string;
  shouldRenderOthers?: boolean;
  otherInputPlaceholder?: string;
  options: {
    label: string | number;
    value: string | number;
  }[];
};

const RadioList = ({
  control,
  name,
  options,
  errors,
  listHeader,
  shouldRenderOthers = false,
  otherInputPlaceholder = '',
}: Props) => {
  const [otherValue, setOtherValue] = useState('');

  return (
    <div className="flex w-full flex-col">
      <span className="mb-2 font-bold">{listHeader}</span>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, name, value } }) => (
          <RadioGroup value={value} name={name} onChange={onChange}>
            <div className="space-y-4">
              {options.map(({ value, label }, index) => {
                return (
                  <RadioGroup.Option key={index} value={value}>
                    {({ checked }) => (
                      <>
                        <div className="flex items-center">
                          <div
                            className={classNames(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-color-border-input-lightmode',
                              checked
                                ? 'bg-color-bg-lightmode-invert'
                                : 'dark:bg-color-bg-darkmode-primary',
                            )}
                          >
                            <div className="h-2 w-2 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                          </div>
                          <div className="ml-3 flex flex-col">
                            <RadioGroup.Label as="span" className="text-brand-gray-800">
                              {label}
                            </RadioGroup.Label>
                          </div>
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                );
              })}
              <RadioGroup.Option
                value={otherValue}
                onBlur={() => {
                  setOtherValue('');
                }}
              >
                {({ checked, active }) => {
                  return (
                    <>
                      {shouldRenderOthers && (
                        <div className="flex items-center">
                          <div
                            className={classNames(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-color-border-input-lightmode',
                              checked
                                ? 'bg-color-bg-lightmode-invert'
                                : 'dark:bg-color-bg-darkmode-primary',
                            )}
                          >
                            <div className="h-2 w-2 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                          </div>
                          <div className="ml-3 flex flex-col">
                            <RadioGroup.Label as="span" className="text-brand-gray-800">
                              Other
                            </RadioGroup.Label>
                          </div>
                          <input
                            value={otherValue}
                            onChange={(e) => {
                              setOtherValue(e.target.value);
                              onChange(e.target.value);
                            }}
                            placeholder={otherInputPlaceholder}
                            className="text-brand-gray-700::placeholder ml-4 h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                          />
                        </div>
                      )}
                    </>
                  );
                }}
              </RadioGroup.Option>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
};

export default RadioList;
