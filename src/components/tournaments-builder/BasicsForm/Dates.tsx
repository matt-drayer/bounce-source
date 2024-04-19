import * as React from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { UseFormRegister } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import * as z from 'zod';
import Calendar from 'svg/Calendar';
import FieldWrapper from '../FieldWrapper';

export const datesSchema = {
  from: z.date(),
  to: z.date(),
};

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
};

const Dates = ({ errors, control }: Props) => {
  return (
    <FieldWrapper label="Dates">
      <div className="flex gap-x-4">
        <div className="flex w-[70%] flex-wrap gap-x-4">
          <div className="flex w-full gap-x-4">
            <div className="w-1/2">
              <span className="mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Start date
              </span>

              <Controller
                control={control}
                name="from"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    wrapperClassName={'w-full'}
                    customInput={
                      <div className="relative">
                        <input
                          name={'from'}
                          value={format(value, 'MM/dd/yy')}
                          readOnly
                          placeholder={'Start date'}
                          className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                        />
                        <Calendar className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                      </div>
                    }
                    value={value}
                    placeholderText="Start date"
                    onChange={onChange}
                    selected={value}
                  />
                )}
              />
            </div>
            <div className="w-1/2">
              <span className="mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                End date
              </span>

              <Controller
                control={control}
                name="to"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    wrapperClassName={'w-full'}
                    customInput={
                      <div className="relative">
                        <input
                          name={'to'}
                          value={format(value, 'MM/dd/yy')}
                          readOnly
                          placeholder={'End date'}
                          className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                        />
                        <Calendar className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                      </div>
                    }
                    value={value}
                    placeholderText="Start date"
                    onChange={onChange}
                    selected={value}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          This is when the tournament will start and end.
        </div>
      </div>
    </FieldWrapper>
  );
};

export default Dates;
