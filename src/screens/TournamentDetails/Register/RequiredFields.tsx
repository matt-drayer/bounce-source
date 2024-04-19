import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DUPR_EXPLANATION } from 'constants/tournaments';
import { Button } from 'components/Button/Button';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';
import Header from './Header';
import {
  ENABLE_BIRTHDAY_REQUIREMENT,
  PropsSetRegistrationFormData,
  RegisterProps,
  tournamentRequirementsFormSchema,
} from './types';

const DUPR_ID_FIELD = 'duprId';
const BIRTHDAY_FIELD = 'birthday';

interface Props extends RegisterProps, PropsSetRegistrationFormData {}

export default function RequiredFields({ event, handleNext, setRegistrationFormData }: Props) {
  const { control, formState, register, watch, handleSubmit } = useForm({
    resolver: zodResolver(tournamentRequirementsFormSchema),
    defaultValues: {
      [DUPR_ID_FIELD]: '',
      [BIRTHDAY_FIELD]: '',
    },
  });
  const birthday = watch(BIRTHDAY_FIELD);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setRegistrationFormData((prev) => ({ ...prev, ...data }));
        handleNext();
      })}
      className="tournament-register-form flex h-full flex-col items-start"
    >
      <div className="flex h-full w-full flex-auto flex-col overflow-y-auto px-6 pb-8 pt-6">
        <Header title="Register" cta="Tournament requirements" />
        <div className="mt-8 w-full">
          {event.isRatingRequired && (
            <div>
              <div>
                <label
                  htmlFor={DUPR_ID_FIELD}
                  className="typography-product-body mb-3 block text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                >
                  This tournament requires DUPR.
                </label>
                <input
                  {...register(DUPR_ID_FIELD, { required: true, minLength: 4 })}
                  type="text"
                  className="input-form block"
                  placeholder="DUPR ID"
                  required
                />
              </div>
              <div className="mt-1 pl-1">
                <Link
                  isExternal
                  className="typography-product-link text-color-text-brand"
                  href={DUPR_EXPLANATION}
                >
                  Find my DUPR ID
                </Link>
              </div>
            </div>
          )}
          {ENABLE_BIRTHDAY_REQUIREMENT && (
            <div className="mt-6">
              <div className="bg-color-bg-lightmode-input dark:bg-color-bg-darkmode-input">
                <label
                  htmlFor={BIRTHDAY_FIELD}
                  className="typography-product-body mb-3 block text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                >
                  This tournament requires age verification.
                </label>
                <input
                  {...register(BIRTHDAY_FIELD, { required: true })}
                  type="date"
                  className={classNames(
                    'input-form block',
                    !!birthday
                      ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                      : 'text-color-text-lightmode-placeholder focus:text-color-text-lightmode-primary dark:text-color-text-darkmode-placeholder dark:focus:text-color-text-darkmode-primary',
                  )}
                  placeholder="Birthday"
                  required
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full px-6 pb-6">
        <Button type="submit" variant="brand" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
}
