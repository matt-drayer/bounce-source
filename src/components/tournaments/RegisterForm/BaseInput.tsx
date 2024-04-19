import * as React from 'react';
import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

type Props = {
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  placeholder: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export default function BaseInput(props: Props) {
  const { register, name, inputProps, placeholder, errors } = props;

  return (
    <>
      <input
        {...register(name)}
        {...(inputProps || {})}
        placeholder={placeholder}
        className="text-brand-gray-700::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
      />
      <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
        {errors?.[name]?.message as any}
      </p>
    </>
  );
}
