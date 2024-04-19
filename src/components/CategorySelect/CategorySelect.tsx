import React, { FC, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import colors from 'styles/colors.json';

const SelectContainer = styled.div`
  .react-select__control {
    border: none;
    background: ${colors.paletteBrandGray.colors[50]};
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
    color: ${colors.paletteBrandGray.colors[600]};
    font-weight: 400;
  }

  input {
    :focus {
      outline: none;
    }
  }
`;

const CategorySelect: FC<{ options: { value: string; label: string }[] }> = (props) => {
  const { options } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <SelectContainer>
      <Select
        placeholder="View all"
        className="react-select-container"
        classNamePrefix="react-select"
        defaultValue={selectedOption}
        onChange={(newValue) => {
          // @ts-ignore
          setSelectedOption(newValue);
        }}
        options={options}
      />
    </SelectContainer>
  );
};

export default CategorySelect;
