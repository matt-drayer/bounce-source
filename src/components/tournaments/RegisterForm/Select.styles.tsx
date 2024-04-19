import styled from 'styled-components';
import colors from 'styles/colors.json';

export const SelectContainer = styled.div`
  .react-select__control {
    border: none;
    background: ${colors.paletteBrandGray.colors[50]};
    box-shadow: none;
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
