import styled from 'styled-components';

const VerticalOverflowText = styled.div<{ lineClamp: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${({ lineClamp }) => lineClamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default VerticalOverflowText;
