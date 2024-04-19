import styled from 'styled-components';
import { tablet } from 'styles/breakpoints';

export const StyledScroll = styled.div`
  ${tablet()} {
    &::-webkit-scrollbar {
      width: 8px;
      background: green;
    }
    &::-webkit-scrollbar-track {
      background: white;
      background: green;
    }
    &::-webkit-scrollbar-thumb {
      background: #b6b4b8;
      background: green;
    }
    &::-webkit-scrollbar-thumb:hover {
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  }
`;
