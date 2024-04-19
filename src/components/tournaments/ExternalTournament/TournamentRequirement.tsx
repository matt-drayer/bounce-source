import * as React from 'react';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FieldValues, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { array, object, string } from 'yup';
import { DUPR_EXPLANATION, ExternalTournament } from 'constants/tournaments';
import Delete from 'svg/Delete';
import Link from 'components/Link';
import BaseSelect from 'components/tournaments/RegisterForm/BaseSelect';

interface Props {
  tournament: ExternalTournament;

  onSubmit(values: FieldValues): void;
}

const eventSchema = {
  email: string().required('Email address is required').email('Enter a valid email'),
  eventType: yup.string().required('Event type is required'),
  rating: yup.string().required('Rating is required'),
};

const schema = yup
  .object({
    duprId: string().optional(),
    events: array().of(object().shape(eventSchema)),
  })
  .required();

const TournamentRequirement = ({ onSubmit, tournament }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: 'events',
    rules: {
      maxLength: 2,
    },
  });

  const eventSelection = tournament.eventSelection;
  const rating = tournament.rating;

  useEffect(() => {
    append({
      rating: '',
      eventType: '',
      email: '',
    });
  }, []);

  const totalAmount = tournament.registrationFee + tournament.eventFee * fields.length;

  return (
    <form onSubmit={handleSubmit((values) => onSubmit({ ...values, amount: totalAmount }))}>
      <p className="mb-8 mt-8 text-[1.12rem] font-semibold text-brand-gray-1000">
        Tournament Registration
      </p>

      <span className="mb-6 flex justify-between font-medium">
        Registration fee <span>${tournament.registrationFee}</span>
      </span>

      {fields.map((item, index) => {
        const field = `events.${index}`;

        // @ts-ignore
        const itemError = errors?.events?.[index];
        const hasError = itemError?.eventType || itemError?.rating || itemError?.email;

        return (
          <div className="flex flex-col" key={index}>
            <div className="flex justify-between">
              <span>Event #{index + 1}</span>
              <span className="flex items-center">
                {fields.length > 1 && (
                  <span onClick={() => remove(index)} className="cursor-pointer">
                    <Delete className="h-5 w-5" />
                  </span>
                )}
                ${tournament.eventFee}
              </span>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="w-[57%]">
                <Controller
                  defaultValue={eventSelection[0]}
                  control={control}
                  name={`${field}.eventType`}
                  render={({ field: { onChange, value } }) => (
                    <BaseSelect
                      value={value}
                      placeholder="Event type"
                      options={eventSelection}
                      onChange={(value) => {
                        onChange(value);
                        resetField(`${field}.rating`);
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-[40%]">
                <Controller
                  control={control}
                  name={`${field}.rating`}
                  render={({ field: { onChange, value } }) => {
                    const selection = getValues(`${field}.eventType`);

                    return (
                      <BaseSelect
                        placeholder="Skill level"
                        isDisabled={!selection}
                        value={value.replace(getValues(`${field}.eventType`), '')}
                        options={rating
                          .filter((rating) => rating.includes(selection))
                          .map((rating) => rating.replace(selection, ''))}
                        onChange={onChange}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <div className="relative mt-4">
              <input
                placeholder="Partner email"
                className="text-brand-gray-700::placeholder h-11 w-full rounded-md bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
                {...register(`events.${index}.email`)}
              />
              <p className="bottom-1 mb-2  mt-1 text-[0.75rem] text-color-error">
                {hasError && <>You have to select an event and submit a partner to register.</>}
              </p>
              <p className="mb-5 text-[0.75rem] text-brand-gray-400">
                You must have a partner to register. Please include their email address and we’ll
                confirm their participation.
              </p>
            </div>
          </div>
        );
      })}

      {fields.length < 2 && (
        <button
          type="button"
          className="flex items-center text-color-error"
          onClick={() =>
            append({
              email: '',
              rating: '',
              eventType: '',
            })
          }
        >
          + Add Event
        </button>
      )}

      <>
        <div className="relative mt-4">
          <div className="mb-4">
            <strong className="font-medium">DUPR ID</strong> (optional)
          </div>

          <input
            placeholder="DUPR ID"
            className="text-brand-gray-700::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
            {...register('duprId')}
          />
          <p className="bottom-1 mb-2  mt-1 text-[0.75rem] text-color-error">
            {errors?.duprId?.message as any}
          </p>
        </div>

        <Link
          isExternal
          className="flex items-center text-[0.75rem] text-color-error"
          href={DUPR_EXPLANATION}
        >
          Find my DUPR ID
        </Link>
      </>
      <div className="mb-8 mt-8 flex justify-between">
        <span>Total</span>
        <span className="flex items-center">${totalAmount}</span>
      </div>

      <button
        type="submit"
        className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic"
      >
        Next
      </button>
    </form>
  );
};

export default TournamentRequirement;
