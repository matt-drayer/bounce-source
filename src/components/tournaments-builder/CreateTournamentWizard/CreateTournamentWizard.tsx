import * as React from 'react';
import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import * as z from 'zod';
import { GetVenuesByGeoQuery } from 'types/generated/client';
import Calendar from 'svg/Calendar';
import CloseIcon from 'svg/CloseIcon';
import { Button } from 'components/Button';
import SearchVenueLocationInput from 'components/SearchVenueLocationInput';
import CheckboxType1 from 'components/forms/checkboxes/CheckboxType1';
import Modal from 'components/modals/Modal';
import InputField from 'components/tournaments-builder/InputField';
import { InputType } from 'components/tournaments-builder/InputField/InputField';
import classNames from 'styles/utils/classNames';

const RadioList = ({
  control,
  name,
  options,
  errors,
  listHeader,
  shouldRenderOthers = false,
  otherInputPlaceholder = '',
}: {
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
}) => {
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
                                : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                            )}
                          >
                            <div className="h-[6px] w-[6px] rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                          </div>
                          <div className="ml-3 flex flex-col">
                            <RadioGroup.Label
                              as="span"
                              className="typography-product-body text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                            >
                              {label}
                            </RadioGroup.Label>
                          </div>
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                );
              })}
              <RadioGroup.Option value={otherValue}>
                {({ checked, active }) => (
                  <>
                    {shouldRenderOthers && (
                      <div className="flex items-center">
                        <div
                          className={classNames(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-color-border-input-lightmode',
                            checked
                              ? 'bg-color-bg-lightmode-invert'
                              : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                          )}
                        >
                          <div className="h-[6px] w-[6px] rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <RadioGroup.Label as="span" className="text-brand-gray-800">
                            Other
                          </RadioGroup.Label>
                        </div>
                        <input
                          value={active ? value : ''}
                          onChange={(e) => onChange(e.target.value)}
                          placeholder={otherInputPlaceholder}
                          className="text-color-text-lightmode-placeholder::placeholder ml-4 h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                        />
                      </div>
                    )}
                  </>
                )}
              </RadioGroup.Option>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
};

type Props = {
  isOpen: boolean;
  totalEvents: number;

  onClose(): void;
};

const schema = {
  title: z.string().min(1, { message: 'Required' }),
  location: z.string().min(1, { message: 'Required' }),
  from: z.date(),
  to: z.date(),
  eventFee: z.preprocess(Number, z.number()),
  registrationFee: z.preprocess(Number, z.number()),
  format: z.string(),
  doubles: z.boolean(),
};

const CreateTournamentWizard = (props: Props) => {
  const { isOpen, totalEvents, onClose } = props;
  const [venues, setVenues] = useState<GetVenuesByGeoQuery['venues']>([]);

  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm({
    // TODO fix types
    resolver: zodResolver<any>(schema),
    defaultValues: {
      registrationDeadline: new Date(),
      from: new Date(),
      to: addDays(new Date(), 2),
      faqs: [{ question: '', answer: '' }],
      doubles: false,
    } as any,
  });

  watch();

  return (
    <Modal isOpen={isOpen} handleClose={() => onClose()} classNameMaxWidth="max-w-3xl">
      <div className="flex justify-between border-b border-color-border-input-lightmode p-6">
        <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Create tournament
        </h3>
        <button
          className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
          type="button"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col pb-ds-xl pl-ds-3xl pr-ds-3xl pt-ds-xl">
        <div className="flex w-full gap-2">
          <div className="w-3/6">
            <InputField
              fieldLabel="Name"
              errors={errors}
              placeholder="Tournament name"
              name="title"
              register={register}
              inputType={InputType.LabelInput}
            />
          </div>
          <div className="flex gap-2">
            <div>
              <InputField
                renderIcon={() => '$'}
                inputProps={{
                  type: 'number',
                }}
                fieldLabel="Registration fee"
                errors={errors}
                placeholder="Registration fee"
                name="registrationFee"
                register={register}
                inputType={InputType.LabelInput}
              />
            </div>
            <div>
              <InputField
                renderIcon={() => '$'}
                inputProps={{
                  type: 'number',
                }}
                fieldLabel="Event fee"
                errors={errors}
                placeholder="Event fee"
                name="eventFee"
                register={register}
                inputType={InputType.LabelInput}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-wrap gap-x-4">
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
                          value={format(value, 'MM/dd/yy')}
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
                          value={format(value, 'MM/dd/yy')}
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

        <div className="mt-6">
          <SearchVenueLocationInput onSearch={(venues) => setVenues(venues)} />
        </div>

        <div className="mt-6 rounded-md bg-color-bg-lightmode-secondary p-6">
          <p className="typography-product-heading-compact mb-8 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Events settings
          </p>
          <div className="mb-8 flex justify-between">
            <div className="flex w-1/2 flex-col">
              <span className="typography-product-body 8 mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Type
              </span>
              <CheckboxType1
                label="Doubles"
                control={control}
                name="doubles"
                labelClassName="mb-3"
              />
              <CheckboxType1 label="Singles" control={control} name="singles" />
            </div>

            <div className="flex w-1/2 flex-col">
              <span className="typography-product-body 8 mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Type
              </span>
              <CheckboxType1
                label="Doubles"
                control={control}
                name="doubles"
                labelClassName="mb-3"
              />
              <CheckboxType1 label="Singles" control={control} name="singles" />
            </div>

            <div className="flex-start flex w-1/2">
              <RadioList
                listHeader={'Format'}
                control={control}
                errors={errors}
                shouldRenderOthers
                name="format"
                options={[
                  { value: 'Round Robin (RR)', label: 'Round Robin (RR)' },
                  { value: 'Single Elimination (SE)', label: 'Single Elimination (SE)' },
                  { value: 'RR & SE', label: 'RR & SE' },
                ]}
              />
            </div>
            <div>
              {/*<SliderNumberRange*/}
              {/*  rangeMinimum={0}*/}
              {/*  rangeMaximum={6}*/}
              {/*  valueMinimum={skillLevelMinimum}*/}
              {/*  valueMaximum={skillLevelMaximum}*/}
              {/*  setValueMinumum={(newMinimum) => setSkillLevelMinimum(newMinimum)}*/}
              {/*  setValueMaximum={(newMaximum) => setSkillLevelMaximum(newMaximum)}*/}
              {/*  step={0.25}*/}
              {/*  decimals={2}*/}
              {/*  isDisabled={!isUsingSkillRange}*/}
              {/*/>*/}
            </div>
          </div>
        </div>
        <span className="typography-informative-caption mt-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          You can edit the tournament details and event specifics after creating your tournament
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-color-border-input-lightmode p-ds-3xl pb-ds-xl pt-ds-xl">
        <span className="font-bold ">
          Total events
          <span className="typography-product-heading-compact ml-4 text-color-text-brand">
            {totalEvents}
          </span>
        </span>
        <Button disabled={false} isInline variant="primary" size="lg" onClick={() => {}}>
          Create tournament
        </Button>
      </div>
    </Modal>
  );
};

export default CreateTournamentWizard;
