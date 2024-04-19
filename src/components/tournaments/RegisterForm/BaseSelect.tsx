import React, { FC } from 'react';
import Select from 'react-select';
import { SelectContainer } from 'components/tournaments/RegisterForm/Select.styles';

const BaseSelect: FC<{
  onChange(value: string): void;
  options: string[];
  value: string;
  placeholder: string;
  isDisabled?: boolean;
}> = ({ options, value, isDisabled = false, onChange, placeholder }) => {
  return (
    <SelectContainer className="w-full">
      <Select
        placeholder={placeholder}
        className="react-select-container"
        classNamePrefix="react-select"
        isSearchable={false}
        isDisabled={isDisabled}
        value={value ? { value, label: value } : null}
        defaultValue={null}
        onChange={(newValue) => {
          // @ts-ignore
          if (newValue) {
            onChange(newValue.value);
          }
        }}
        options={options.map((value) => ({
          value,
          label: value,
        }))}
      />
    </SelectContainer>
  );
};

export default BaseSelect;
