import styled from 'styled-components';
import { mobile, tablet } from 'styles/breakpoints';

export const BackgroundImage = styled.div<{ desktopImageUrl: string; mobileImageUrl: string }>`
  background-image: ${({ desktopImageUrl }) =>
    desktopImageUrl ? `url('${desktopImageUrl}')` : 'white'};

  ${mobile()} {
    background-image: ${({ mobileImageUrl }) =>
      mobileImageUrl ? `url('${mobileImageUrl}')` : 'white'};
  }
  ${tablet()} {
    background-image: ${({ mobileImageUrl }) =>
      mobileImageUrl ? `url('${mobileImageUrl}')` : 'white'};
  }
`;
