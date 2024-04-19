import { FC } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors.json';

const Tag: FC<{ text: string; classes?: string }> = ({ text, classes }) => {
  return (
    <StyledTag
      className={`text-color-text-lightmode-primary dark:text-color-text-darkmode-primary ${
        classes || ''
      }`}
    >
      {text}
    </StyledTag>
  );
};

const StyledTag = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 2px;
  background: ${colors.paletteBrandGray.colors[50]};

  border-radius: 16px;
  font-size: 14px;
`;
export default Tag;
