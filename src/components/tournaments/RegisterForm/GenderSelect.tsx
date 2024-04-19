import React, { FC, useState } from 'react';
import Select from 'react-select';
import { GenderEnum } from 'types/generated/client';
import { SelectContainer } from 'components/tournaments/RegisterForm/Select.styles';

const options = [
  { value: GenderEnum.Female, label: 'Female' },
  {
    value: GenderEnum.Male,
    label: 'Male',
  },
];

const GenderSelect: FC<{ onChange(value: string): void }> = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <SelectContainer>
      <Select
        placeholder="Gender"
        className="react-select-container"
        classNamePrefix="react-select"
        isSearchable={false}
        defaultValue={selectedOption}
        onChange={(newValue) => {
          // @ts-ignore
          setSelectedOption(newValue);

          if (newValue) {
            props.onChange(newValue.value);
          }
        }}
        options={options}
      />
    </SelectContainer>
  );
};

export default GenderSelect;
