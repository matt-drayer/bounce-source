import * as React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { UseFormGetValues } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import * as z from 'zod';
import { GENDER_OPTIONS } from 'utils/shared/string/tournamentBuilder';
import InputField from 'components/tournaments-builder/InputField';
import { InputType } from 'components/tournaments-builder/InputField/InputField';
import Select from 'components/tournaments-builder/Select';
import Switcher from 'components/tournaments-builder/Switcher';
import FieldWrapper from '../FieldWrapper';

export const settingsSchema = {
  maxNumOfTeams: z.number(),
  minNumOfTeams: z.number(),
  eventFee: z.number(),
  gender: z.string(),
  eventType: z.string(),
  rating: z.string(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  minRating: z.number(),
  maxRating: z.number(),
  ageRestriction: z.boolean(),
};

type Props = {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  fieldName: string;
  getValues: UseFormGetValues<any>;
};

const Settings = ({ errors, getValues, register, control, fieldName }: Props) => {
  return (
    <FieldWrapper label="Settings">
      <div className="mb-4 flex w-full gap-x-4">
        <div className="flex w-[70%] gap-x-4">
          <div className="w-1/2">
            <div className="mb-4">
              <Select
                placeholder="Gender"
                errors={errors}
                control={control}
                name={`${fieldName}.gender`}
                label="Gender"
                options={GENDER_OPTIONS}
              />
            </div>

            <div className="mb-4 pb-5 pt-9">
              <Switcher
                errors={errors}
                control={control}
                name={`${fieldName}.ageRestriction`}
                label="Age restriction"
              />
            </div>

            <div className="mb-4">
              <Select
                placeholder="Rating system"
                errors={errors}
                control={control}
                name={`${fieldName}.rating`}
                label="Rating system"
                options={[{ value: 'UTPR', label: 'UTPR' }]}
              />
            </div>

            <div>
              <InputField
                inputProps={{
                  type: 'number',
                }}
                fieldLabel="Minimum number of teams"
                errors={errors}
                placeholder="Minimum number of teams"
                name={`${fieldName}.minNumOfTeams`}
                register={register}
                inputType={InputType.LabelInput}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="mb-4">
              <Select
                placeholder="Event type"
                errors={errors}
                control={control}
                name={`${fieldName}.eventType`}
                label="Event type"
                options={[
                  { value: 'DOUBLES', label: 'Doubles' },
                  { value: 'SINGLES', label: 'Singles' },
                ]}
              />
            </div>

            <div className="mb-4 flex [&>div:first-child]:mr-4">
              <InputField
                fieldLabel="Min age"
                errors={errors}
                placeholder="Min age"
                name={`${fieldName}.minAge`}
                register={register}
                inputType={InputType.LabelInput}
                inputProps={{
                  type: 'number',
                  disabled: !getValues(`${fieldName}.ageRestriction`),
                }}
              />
              <InputField
                fieldLabel="Max age"
                errors={errors}
                placeholder="Max age"
                name={`${fieldName}.maxAge`}
                register={register}
                inputType={InputType.LabelInput}
                inputProps={{
                  type: 'number',
                  disabled: !getValues(`${fieldName}.ageRestriction`),
                }}
              />
            </div>
            <div className="mb-4 flex [&>div:first-child]:mr-4">
              <InputField
                fieldLabel="Min rating"
                errors={errors}
                placeholder="Min rating"
                name={`${fieldName}.minRating`}
                register={register}
                inputType={InputType.LabelInput}
                inputProps={{
                  type: 'number',
                }}
              />
              <InputField
                fieldLabel="Max rating"
                errors={errors}
                placeholder="Max rating"
                name={`${fieldName}.maxRating`}
                register={register}
                inputType={InputType.LabelInput}
                inputProps={{
                  type: 'number',
                }}
              />
            </div>
            <div>
              <InputField
                fieldLabel="Maximum number of teams"
                errors={errors}
                inputProps={{
                  type: 'number',
                }}
                placeholder="Maximum number of teams"
                name={`${fieldName}.maxNumOfTeams`}
                register={register}
                inputType={InputType.LabelInput}
              />
            </div>
          </div>
        </div>
        <div className="typography-product-caption w-[30%] text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Complete the details for your event.{' '}
        </div>
      </div>
      <div className="flex w-[70%] pr-3 [&>div]:w-full">
        <InputField
          renderIcon={() => '$'}
          inputProps={{
            type: 'number',
          }}
          fieldLabel="Event fee"
          errors={errors}
          placeholder="Event fee"
          name={`${fieldName}.eventFee`}
          register={register}
          inputType={InputType.RegularWithIcon}
        />
      </div>
    </FieldWrapper>
  );
};

export default Settings;
