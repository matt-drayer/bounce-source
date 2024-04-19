import * as React from 'react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { BallTypesEnum, EventPrivacyEnum } from 'types/generated/client';
import { BALL_OPTIONS } from 'utils/shared/string/tournamentBuilder';
import { useModal } from 'hooks/useModal';
import Calendar from 'svg/Calendar';
import Delete from 'svg/Delete';
import { Button, ButtonText } from 'components/Button';
import AddVenue from 'components/tournaments-builder/BasicsForm/AddVenue';
import Dates from 'components/tournaments-builder/BasicsForm/Dates';
import { datesSchema } from 'components/tournaments-builder/BasicsForm/Dates';
import FieldWrapper from 'components/tournaments-builder/FieldWrapper';
import InputField from 'components/tournaments-builder/InputField';
import { InputType } from 'components/tournaments-builder/InputField/InputField';
import Select from 'components/tournaments-builder/Select';
import Switcher from 'components/tournaments-builder/Switcher';
import Dropzone from 'components/utilities/Dropzone';

interface TournamentData {
  faqs?: {
    question: string;
    answer: string;
  }[];
  registrationDeadlineDate?: string;
  startDate?: string;
  endDate?: string;
  privacy?: EventPrivacyEnum;
  isSanctioned?: boolean;
  hasPrizes?: boolean;
  title?: string;
  description?: string;
  registrationPriceUnitAmount?: number;
  sponsors?: any[];
  ballType?: BallTypesEnum;
  venue?: any;
}

type Props = {
  onChange(values: Record<string, any>, isValid: boolean): void;
  tournamentData: TournamentData;
};

const faqsShema = z.object({
  question: z.string(),
  answer: z.string(),
});

const sponsorsSchema = z.object({
  file: z.any(),
  name: z.string(),
  url: z.string(),
  isFeatured: z.boolean(),
});

const schema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  overview: z.string().min(1, { message: 'Required' }),
  registrationFee: z.number(),
  registrationDeadline: z.date(),
  ball: z.string().min(1, { message: 'Required' }),
  prizes: z.string().optional(),
  private: z.boolean(),
  sanctioned: z.boolean(),
  hasPrizes: z.boolean(),
  faqs: faqsShema.array(),
  sponsors: sponsorsSchema.array(),
  banner: z.any(),
  venue: z.any(),

  ...datesSchema,
});
const isValidDate = (date: any) => date instanceof Date && !isNaN(date.getTime());
const getDefaultDate = (date?: string) => (date && isValidDate(date) ? new Date(date) : new Date());

const BasicsForm = ({ onChange, tournamentData }: Props) => {
  const FAQ = {
    question:
      tournamentData && tournamentData.faqs && tournamentData.faqs.length > 0
        ? tournamentData.faqs[0]?.question
        : '',
    answer:
      tournamentData && tournamentData.faqs && tournamentData.faqs.length > 0
        ? tournamentData.faqs[0]?.answer
        : '',
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValidating, isValid },
  } = useForm<any>({
    resolver: zodResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      registrationDeadline: getDefaultDate(tournamentData?.registrationDeadlineDate),
      from: getDefaultDate(tournamentData?.startDate),
      to: getDefaultDate(tournamentData?.endDate) || addDays(new Date(), 2),
      faqs: tournamentData?.faqs || [FAQ],
      private: tournamentData?.privacy === EventPrivacyEnum.Public ? false : true,
      sanctioned: tournamentData?.isSanctioned || false,
      hasPrizes: tournamentData?.hasPrizes || false,
      title: tournamentData?.title || '',
      overview: tournamentData?.description || '',
      registrationFee: tournamentData ? tournamentData.registrationPriceUnitAmount : null,
      sponsors: tournamentData?.sponsors || [],
      ball:
        tournamentData?.ballType !== BallTypesEnum.NotSelected
          ? tournamentData?.ballType
          : BallTypesEnum.NotSelected,
    },
  });

  const {
    fields,
    append,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  const {
    fields: sponsors,
    remove: removeSponsor,
    append: appendSponsor,
  } = useFieldArray({
    control,
    name: 'sponsors',
  });

  const {
    openModal: openVenueModal,
    isOpen: isVenueModalOpen,
    closeModal: closeVenueModal,
  } = useModal();

  useEffect(() => {
    onChange({ ...getValues() }, isValid);
    console.log(getValues('ball'));
  }, [isValid, isValidating]);

  return (
    <form>
      <InputField
        fieldLabel="Name"
        fieldDesc="Give your tournament a unique, descriptive name"
        errors={errors}
        placeholder="Tournament name"
        name="title"
        register={register}
        inputType={InputType.Regular}
      />
      <InputField
        fieldLabel="Overview"
        fieldDesc="Lorem ipsum dolor sit."
        errors={errors}
        placeholder="Tell more about your tournament"
        name="overview"
        register={register}
        inputType={InputType.Textarea}
      />
      <Dates errors={errors} control={control} />
      <FieldWrapper label="Registration fee">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap gap-x-4 [&>div]:w-full">
            <InputField
              renderIcon={() => '$'}
              inputProps={{
                type: 'number',
              }}
              fieldLabel=""
              errors={errors}
              placeholder="Registration fee"
              name="registrationFee"
              register={register}
              inputType={InputType.RegularWithIcon}
            />
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            This is the baseline fee for the tournament. In the next section, you can add additional
            fees per event.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Registration deadline">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap gap-x-4">
            <Controller
              control={control}
              name="registrationDeadline"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  wrapperClassName={'w-full'}
                  customInput={
                    <div className="relative">
                      <input
                        value={format(value, 'MM/dd/yy')}
                        readOnly
                        name="registrationDeadline"
                        placeholder={'Registration deadline'}
                        className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                      />
                      <Calendar className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform [&>path]:fill-color-text-lightmode-icon" />
                    </div>
                  }
                  value={value.toString()}
                  placeholderText="Registration deadline"
                  onChange={onChange}
                  selected={value}
                />
              )}
            />
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            This is the last day in which players can register for the tournament.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Tournament banner">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-start gap-x-4 [&>div]:w-full">
            <Controller
              control={control}
              name="banner"
              render={({ field: { onChange } }) => {
                return (
                  <Dropzone
                    onSelectFiles={(files) => {
                      onChange(files[0]);
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            This is the photo players will see on the Bounce marketplace. The quality of the image
            is important.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Venue">
        <Controller
          control={control}
          name="venue"
          render={({ field: { onChange } }) => {
            return (
              <>
                <AddVenue
                  isOpen={isVenueModalOpen}
                  onClose={closeVenueModal}
                  onSubmit={(venue) => {
                    onChange(venue);
                    closeVenueModal();
                  }}
                />
              </>
            );
          }}
        />
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-center gap-x-4 [&>div]:w-full">
            {tournamentData?.venue ? (
              <Button isInline variant="inverted" size={'sm'} onClick={() => openVenueModal()}>
                Change venue
              </Button>
            ) : (
              <Button isInline variant="inverted" size={'sm'} onClick={() => openVenueModal()}>
                Add a venue
              </Button>
            )}
            {getValues('venue')?.title ? (
              <span>{getValues('venue').title}</span>
            ) : (
              tournamentData?.venue && <span>{tournamentData.venue.title}</span>
            )}
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            This is where the tournament will take place.{' '}
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Ball used">
        <div className="mb-4 flex w-full gap-x-4">
          <div className="flex w-[70%] gap-x-4">
            <div className="w-1/2">
              <div className="mb-4">
                <Select
                  placeholder="Ball used"
                  errors={errors}
                  control={control}
                  name="ball"
                  options={BALL_OPTIONS}
                />
              </div>
            </div>
          </div>

          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            The ball you will be using throughout the tournament. It’s important to use one type of
            ball, and new ones.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="FAQs" className="!pb-0">
        {fields.map((item, index) => {
          const field = `faqs.${index}`;

          return (
            <div className="mb-12 flex w-full gap-x-4" key={index}>
              <div className="flex w-[70%] flex-col flex-wrap items-start gap-x-4">
                <span className="flex w-full items-center justify-between font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Question {index + 1}{' '}
                  <Delete
                    className="h-6 w-6 cursor-pointer fill-color-text-lightmode-icon"
                    onClick={() => removeFaq(index)}
                  />
                </span>

                <input
                  autoFocus={false}
                  {...register(`${field}.question`)}
                  placeholder="Question"
                  className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder mb-3 mt-3 h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                />

                <textarea
                  {...register(`${field}.answer`)}
                  placeholder="Answer"
                  autoFocus={false}
                  className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder min-h-[80px] w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                />
              </div>

              <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {index === 0 && (
                  <>
                    Add questions that players often ask and provide them with answers. We recommend
                    addressing topics such as rating systems, refunds, cancellations, finding
                    partners and similar.
                  </>
                )}
                {index > 0 && <>Give your tournament a unique, descriptive name</>}
              </div>
            </div>
          );
        })}
        <ButtonText
          className="mb-6 cursor-pointer font-medium text-color-brand-primary"
          onClick={() => append(FAQ)}
        >
          + Add Question
        </ButtonText>
      </FieldWrapper>
      <FieldWrapper label="Prizes">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-start gap-x-4 [&>div]:w-full">
            <Switcher errors={errors} control={control} name="hasPrizes" />

            <div className="mt-6 w-full">
              <textarea
                disabled={!getValues('hasPrizes')}
                {...register('prizes')}
                placeholder="Describe your alternative prizes"
                className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-[80px] w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
              />
              <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
                {errors?.prizes?.message as any}
              </p>
            </div>
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            If you don't want the tournament to appear on the Bounce marketplace, make it private.
            If private, you’ll have a unique link to share with players.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Sponsors">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-start gap-x-4 [&>div]:w-full">
            {sponsors.map((item, index) => {
              const field = `sponsors.${index}`;

              return (
                <div className="mb-12 flex w-full gap-x-4" key={index}>
                  <div className="flex w-full flex-col flex-wrap items-start gap-x-4">
                    <span className="flex w-full items-center justify-between font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Sponsor {index + 1}
                      <Delete
                        className="h-6 w-6 cursor-pointer fill-color-text-lightmode-icon"
                        onClick={() => {
                          removeSponsor(index);
                        }}
                      />
                    </span>

                    <input
                      {...register(`${field}.name`)}
                      placeholder="Sponsor Name"
                      className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder mt-3 h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                    />

                    <input
                      {...register(`${field}.url`)}
                      placeholder="Sponsor URL"
                      className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder mb-3 mt-3 h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
                    />

                    <span className="mb-3 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Sponsor image
                    </span>

                    <Controller
                      control={control}
                      name={`${field}.file`}
                      render={({ field: { onChange } }) => {
                        return (
                          <Dropzone
                            onSelectFiles={(files) => {
                              onChange(files[0]);
                            }}
                          />
                        );
                      }}
                    />

                    <div className="mt-2">
                      <Switcher
                        errors={errors}
                        control={control}
                        name={`${field}.isFeatured`}
                        label="Featured sponsor"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <ButtonText
              className="mb-6 cursor-pointer font-medium text-color-brand-primary"
              onClick={() => appendSponsor(sponsors)}
            >
              + Add Sponsor
            </ButtonText>
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            If the tournament as sponsors, add their photo(s) here.{' '}
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Private">
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-start gap-x-4 [&>div]:w-full">
            <Switcher errors={errors} control={control} name="private" />
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            If you don't want the tournament to appear on the Bounce marketplace, make it private.
            If private, you’ll have a unique link to share with players.
          </div>
        </div>
      </FieldWrapper>
      <FieldWrapper label="Sanctioned" isLast>
        <div className="flex w-full gap-x-4">
          <div className="flex w-[70%] flex-wrap items-start gap-x-4 [&>div]:w-full">
            <Switcher errors={errors} control={control} name="sanctioned" />
          </div>
          <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Is your tournament sanctioned by USA Pickleball?
          </div>
        </div>
      </FieldWrapper>
    </form>
  );
};

export default BasicsForm;
