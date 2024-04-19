import React from 'react';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import ReactSelect from 'react-select';
import styled from 'styled-components';
import colors from 'styles/colors.json';

export const SelectContainer = styled.div`
  .react-select__control {
    border: none;
    background: ${colors.paletteBrandGray.colors[50]};
    box-shadow: none;
    height: 43px;
  }

  .react-select__indicator-separator {
    display: none;
  }

  .react-select__indicator {
    svg {
      fill: ${colors.paletteBrandGray.colors[500]};
    }
  }

  .react-select__placeholder {
    color: ${colors.paletteBrandGray.colors[700]};
    font-weight: 300;
  }

  input {
    :focus {
      outline: none;
    }
  }
`;

type Props = {
  label?: string;
  name: string;
  errors: FieldErrors<any>;
  control: Control<any>;
  placeholder: string;
  options: { value: string; label: string }[];
};

const Select = ({ control, label, name, errors, options, placeholder }: Props) => {
  return (
    <div className="flex flex-col">
      {label && (
        <span className="mb-2 font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {label}
        </span>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, disabled, value } }) => {
          return (
            <SelectContainer className="w-full">
              <ReactSelect
                placeholder={placeholder}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
                isDisabled={disabled}
                onChange={(newValue) => {
                  // @ts-ignore
                  if (newValue) {
                    onChange(newValue.value);
                  }
                }}
                options={options}
                defaultValue={options.find((opt) => opt.value === value)}
              />
            </SelectContainer>
          );
        }}
      />
      <p className="bottom-1 mt-1 text-[0.75rem] text-color-error">
        {errors?.[name]?.message as any}
      </p>
    </div>
  );
};

export default Select;
