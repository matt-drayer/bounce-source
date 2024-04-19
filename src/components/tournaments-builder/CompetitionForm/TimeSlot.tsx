import * as React from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { UseFormGetValues } from 'react-hook-form';
import * as z from 'zod';
import Calendar from 'svg/Calendar';
import Clock from 'svg/Clock';
import FieldWrapper from '../FieldWrapper';

export const timeSlotSchema = {
  timeSlotDate: z.date(),
  timeSlotFrom: z.date(),
  timeSlotTo: z.date(),
};

type Props = {
  control: Control<any>;
  getValues: UseFormGetValues<any>;
  fieldName: string;
};

const TimeSlot = ({ getValues, control, fieldName }: Props) => {
  return (
    <FieldWrapper label="Time slot">
      <div className="flex gap-x-4">
        <div className="flex w-[70%] flex-wrap gap-x-4">
          <div className="flex w-full gap-x-4">
            <div className="mb-4 w-1/2">
              <Controller
                control={control}
                name={`${fieldName}.timeSlotDate`}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    wrapperClassName={'w-full'}
                    customInput={
                      <div className="relative">
                        <input
                          readOnly
                          name={`${fieldName}.timeSlotDate`}
                          value={format(value, 'MM/dd/yy')}
                          placeholder={'Time slot'}
                          className="text-color-text-lightmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                        />
                        <Calendar className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                      </div>
                    }
                    value={value}
                    placeholderText="Time slot"
                    onChange={onChange}
                    selected={value}
                  />
                )}
              />
            </div>
            <div className="mb-4 flex w-1/2 items-center font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
                getValues(`${fieldName}.timeSlotDate`),
              )}
            </div>
          </div>

          <div className="flex w-full gap-x-4">
            <div className="w-1/2">
              <Controller
                control={control}
                name={`${fieldName}.timeSlotFrom`}
                render={({ field: { onChange, value } }) => (
                  <>
                    <DatePicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      wrapperClassName={'w-full mr-4'}
                      value={value}
                      customInput={
                        <div className="relative">
                          <input
                            readOnly
                            name={`${fieldName}.timeSlotFrom`}
                            value={format(value, 'hh:mm a')}
                            placeholder={'Time slot'}
                            className="text-color-text-lightmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                          />
                          <Clock className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                        </div>
                      }
                      placeholderText="Birth Date"
                      onChange={onChange}
                      selected={value}
                    />
                  </>
                )}
              />
            </div>
            <div className="w-1/2">
              <Controller
                control={control}
                name={`${fieldName}.timeSlotTo`}
                render={({ field: { onChange, value } }) => (
                  <>
                    <DatePicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      wrapperClassName={'w-full mr-4'}
                      customInput={
                        <div className="relative">
                          <input
                            readOnly
                            name={`${fieldName}.timeSlotTo`}
                            value={format(value, 'hh:mm a')}
                            placeholder={'Time slot'}
                            className="text-color-text-lightmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                          />
                          <Clock className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                        </div>
                      }
                      placeholderText="Time slot"
                      onChange={onChange}
                      selected={value}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
        {/*<div className="w-2/3">{watch()}</div>*/}
        <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Inform players of the schedule of play for this event.
        </div>
      </div>
    </FieldWrapper>
  );
};

export default TimeSlot;
