import { differenceInMinutes } from 'date-fns';

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
export const PLAYER_LESSON_REFUND_MINUTES = HOURS_PER_DAY * MINUTES_PER_HOUR;

interface Params {
  lessonStartDateTime: Date;
}

export const getIsPlayerCancelRefundable = ({ lessonStartDateTime }: Params) => {
  const minutesUntilLesson = differenceInMinutes(lessonStartDateTime, new Date());
  return minutesUntilLesson > PLAYER_LESSON_REFUND_MINUTES;
};
