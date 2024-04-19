import styled from 'styled-components';

const EDGE_OFFSET_PX = 2;

const getPercent = ({
  value,
  rangeMinimum,
  rangeMaximum,
}: {
  value: number;
  rangeMinimum: number;
  rangeMaximum: number;
}) => (value - rangeMinimum) / (rangeMaximum - rangeMinimum);

export const MultiRangeBackground = styled.div<{
  valueMinimum: number;
  valueMaximum: number;
  rangeMinimum: number;
  rangeMaximum: number;
  thumbWidth: string;
}>`
  z-index: 2;
  width: calc(
    ${({ valueMinimum, valueMaximum, rangeMinimum, rangeMaximum }) => {
        const minPercent = getPercent({ value: valueMinimum, rangeMinimum, rangeMaximum });
        const maxPercent = getPercent({ value: valueMaximum, rangeMinimum, rangeMaximum });

        return (maxPercent - minPercent) * 100;
      }}% +
      ${({ valueMinimum, valueMaximum, rangeMinimum, rangeMaximum }) => {
        const minPercent = getPercent({ value: valueMinimum, rangeMinimum, rangeMaximum });
        const maxPercent = getPercent({ value: valueMaximum, rangeMinimum, rangeMaximum });

        return 1 - (maxPercent - minPercent);
      }} * ${({ thumbWidth }) => thumbWidth} - ${EDGE_OFFSET_PX}px
  );
  left: calc(
    ${({ valueMinimum, rangeMinimum, rangeMaximum }) =>
        getPercent({ value: valueMinimum, rangeMinimum, rangeMaximum }) * 100}% -
      ${({ valueMinimum, rangeMinimum, rangeMaximum }) =>
        getPercent({ value: valueMinimum, rangeMinimum, rangeMaximum })} *
      ${({ thumbWidth }) => thumbWidth} + ${EDGE_OFFSET_PX / 2}px
  );
`;
