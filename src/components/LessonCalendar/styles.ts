import styled from 'styled-components';

export const WeeklyCalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 40px repeat(7, minmax(40px, 1fr));
`;

export const TimeLine = styled.div<{ top: number }>`
  height: 1px;
  top: ${({ top }) => top}%;
`;

export const LessonBlock = styled.button<{
  heightPercent: number;
  widthPercent: number;
  leftPercent: number;
  topPercent: number;
}>`
  padding: 1px;
  height: calc(${({ heightPercent }) => heightPercent}% - 1px);
  width: calc(${({ widthPercent }) => widthPercent}% - 1px);
  left: ${({ leftPercent }) => leftPercent}%;
  top: ${({ topPercent }) => topPercent}%;
  overflow: hidden;
`;
