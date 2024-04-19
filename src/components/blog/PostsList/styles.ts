import styled from 'styled-components';
import { mobile, tablet } from 'styles/breakpoints';
import colors from 'styles/colors.json';

export const Filters = styled.div`
  display: flex;
  margin-bottom: 4em;

  .checkmark {
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${colors.paletteBrandGray.colors[50]};
    width: 128px;
    height: 44px;
    font-size: 1rem;
    color: ${colors.paletteBrandGray.colors[600]};
    border-radius: 6px;
    cursor: pointer;
  }

  input {
    display: none;

    :checked {
      + .checkmark {
        border: 2px solid #4d38ab;
        background: transparent;
        color: ${colors.paletteBrandGray.colors[800]};
      }
    }
  }
`;

export const Container = styled.div``;

export const Pagination = styled.div`
  border-top: 1px solid ${colors.paletteBrandGray.colors[200]};
  padding-top: 1.3em;

  > ul {
    display: flex;
  }

  .previous,
  .next {
    display: flex;

    a {
      display: flex;
      align-items: center;
      font-size: 1rem;
      color: ${colors.paletteBrandBlue.colors[900]};
      font-weight: 500;
    }

    svg {
      fill: ${colors.paletteBrandBlue.colors[600]};
    }
  }

  .previous {
    margin-right: auto;

    svg {
      margin-right: 5px;
    }
  }

  .next {
    margin-left: auto;

    svg {
      transform: rotate(180deg);
      margin-left: 5px;
    }
  }

  .disabled {
    color: ${colors.paletteBrandGray.colors[200]};

    svg {
      fill: ${colors.paletteBrandGray.colors[200]};
    }
  }

  li:not(.previous, .next) {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    font-size: 0.9rem;
    color: ${colors.paletteBrandGray.colors[600]};

    &.selected {
      background: ${colors.paletteBrandGray.colors[50]};
      color: ${colors.paletteBrandGray.colors[800]};
    }

    > a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &.mobile {
    &.selected {
      background: transparent;
    }
  }
`;

export const List = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  > div {
    max-width: 378px;
    margin-bottom: 3em;
  }

  ${tablet()} {
    > div {
      max-width: 45%;
    }
  }

  ${mobile()} {
    > div {
      max-width: 100%;
    }
  }
`;
