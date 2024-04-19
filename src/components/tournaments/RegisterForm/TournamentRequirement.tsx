import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { DUPR_EXPLANATION } from 'constants/tournaments';
import Link from 'components/Link';
import BaseInput from 'components/tournaments/RegisterForm/BaseInput';
import classNames from 'styles/utils/classNames';

const HAS_DUPR_ID = ['Yes', 'No'];

interface Props {
  onSubmit(values: Form): void;
}

type Form = {
  duprId: string;
  partnerEmail: string;
  hasDuprId: string;
};

const schema = yup
  .object({
    duprId: yup.string().optional(),
    hasDuprId: yup.string().optional(),
    partnerEmail: yup.string().required('Email is required').email('Email should be valid'),
  })
  .required();

const TournamentRequirement = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {
      hasDuprId: 'Yes',
    },
  });

  const hasDuprId = watch('hasDuprId') === 'Yes';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-8 mt-8 text-[1.12rem] font-semibold text-brand-gray-1000">
        Tournament requirement
      </p>

      <p className="mb-1 flex items-center text-brand-gray-800">Do you have a DUPR account? </p>
      <Link
        isExternal
        className="mb-6 flex items-center text-[0.75rem] text-color-error"
        href={DUPR_EXPLANATION}
      >
        Find my DUPR ID <ArrowUpRightIcon className="ml-1 h-3.5 w-3.5" />
      </Link>

      <Controller
        name="hasDuprId"
        control={control}
        defaultValue={HAS_DUPR_ID[0]}
        render={({ field }) => (
          <RadioGroup className="mb-6" value={field.value} onChange={field.onChange}>
            <RadioGroup.Label className="sr-only">DUPR ID</RadioGroup.Label>
            <div className="space-y-4">
              {HAS_DUPR_ID.map((value) => (
                <RadioGroup.Option key={value} value={value}>
                  {({ active, checked }) => (
                    <div className="flex items-center">
                      <div
                        className={classNames(
                          'flex h-[24px] w-[24px] items-center justify-center rounded-full border border-brand-gray-100',
                          checked
                            ? 'bg-brand-fire-500'
                            : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                        )}
                      >
                        <div className="h-[8px] w-[8px] rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <RadioGroup.Label as="span" className="ml-2 text-brand-gray-800">
                          {value}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        )}
      />

      {hasDuprId && (
        <>
          <div className="relative">
            <BaseInput
              placeholder="DUPR ID"
              name="duprId"
              errors={errors as any}
              register={register}
            />
          </div>

          <p className="mb-6 text-[.75rem] text-brand-gray-400">
            The DUPR ID is necessary for your matches to count towards your DUPR rating. We also use
            the rating to confirm eligibility for prize money.
          </p>
        </>
      )}

      {!hasDuprId && (
        <p className="mb-6 text-brand-gray-800">
          No problem. We prefer a DUPR rating to ensure fair play, but we trust that players are
          aware of their skill level.{' '}
        </p>
      )}

      <div className="relative">
        <BaseInput
          placeholder="Partner email"
          name="partnerEmail"
          errors={errors as any}
          register={register}
        />
      </div>
      <p className="mb-6 text-[.75rem] text-brand-gray-400">
        If you do not have a partner input{' '}
        <span className="text-color-error">team@bounce.game</span> as your partner's email and we
        will find a partner for you. If not, you will be fully refunded.{' '}
      </p>
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
