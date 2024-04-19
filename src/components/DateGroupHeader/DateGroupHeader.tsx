import * as React from 'react';
import { format, isSameDay } from 'date-fns';

interface Props {
  today: Date;
  date: Date;
}

const DateGroupHeader = ({ today, date }: Props) => {
  return (
    <div className="rounded-md text-sm leading-4 lg:text-lg">
      <span className="text font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        {format(date, 'LLL do')}
      </span>
      <span className="ml-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        {format(date, 'ccc')}
        {isSameDay(today, date) && <span> · Today</span>}
      </span>
    </div>
  );
};

export default DateGroupHeader;
