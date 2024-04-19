import * as React from 'react';
import { mapToUsDate } from 'utils/shared/date/mapToUsDate';

const ClosedModal = ({ date }: { date: string }) => {
  return (
    <div className="mb-5 w-full self-start rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary sm:mb-0 sm:w-[38%] md:w-[28%] md:pl-8 md:pr-8">
      <p className="text-[1.25rem] font-semibold  italic text-brand-fire-500">
        Registration Closed
      </p>
      <p className="mb-4 mt-6 text-center">Registration closed</p>

      <p className="mb-4 text-center text-[1.12rem] font-bold">{mapToUsDate(date)}</p>
    </div>
  );
};

export default ClosedModal;
