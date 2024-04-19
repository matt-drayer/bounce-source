import * as React from 'react';
import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import FieldWrapper from 'components/tournaments-builder/FieldWrapper';

export enum InputType {
  Regular = 'regular',
  RegularWithIcon = 'regularIcon',
  Textarea = 'textarea',
  LabelInput = 'label',
}

type Props = {
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  placeholder: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;

  fieldLabel?: string;
  fieldDesc?: string;

  inputType: InputType;

  renderIcon?(): React.ReactNode;
};

const InputField = (props: Props) => {
  const {
    register,
    renderIcon,
    inputType,
    fieldLabel,
    fieldDesc,
    name,
    inputProps,
    placeholder,
    errors,
  } = props;

  const inputNativeType = inputProps?.type;

  const buildRegister = (register: UseFormRegister<any>) => {
    return register(name, {
      valueAsNumber: inputNativeType === 'number',
    });
  };

  if (inputType === InputType.Regular) {
    return (
      <FieldWrapper label={fieldLabel}>
        <input
          {...buildRegister(register)}
          {...(inputProps || {})}
          placeholder={placeholder}
          className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
        />
        <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
          {errors?.[name]?.message as any}
        </p>
      </FieldWrapper>
    );
  }

  if (inputType === InputType.Textarea) {
    return (
      <FieldWrapper label={fieldLabel}>
        <textarea
          {...buildRegister(register)}
          placeholder={placeholder}
          className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-[80px] w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
        />
        <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
          {errors?.[name]?.message as any}
        </p>
      </FieldWrapper>
    );
  }

  if (inputType === InputType.LabelInput) {
    return (
      <div className="flex flex-col">
        <span className="mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {fieldLabel}
        </span>

        <input
          {...buildRegister(register)}
          {...(inputProps || {})}
          placeholder={placeholder}
          className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
        />
        <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
          {errors?.[name]?.message as any}
        </p>
      </div>
    );
  }

  if (inputType === InputType.RegularWithIcon) {
    return (
      <div className="flex flex-col">
        {fieldLabel && (
          <span className="mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            {fieldLabel}
          </span>
        )}

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
            {renderIcon && renderIcon()}
          </div>
          <input
            {...buildRegister(register)}
            {...(inputProps || {})}
            placeholder={placeholder}
            className="text-color-text-lightmode-placeholder::placeholder dark:text-color-text-darkmode-placeholder::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-7 pr-3 font-light text-color-text-lightmode-primary focus:outline-0 dark:text-color-text-darkmode-primary"
          />
        </div>
        <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
          {errors?.[name]?.message as any}
        </p>
      </div>
    );
  }
};

export default InputField;
