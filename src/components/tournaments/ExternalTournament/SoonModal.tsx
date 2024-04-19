import { FC } from 'react';
import * as React from 'react';
import { mapToUsDate } from 'utils/shared/date/mapToUsDate';

const SoonModal: FC<{ registrationDate: string }> = ({ registrationDate }) => {
  return (
    <>
      <p className="text-[1.25rem] font-semibold  italic text-brand-fire-500">Stay tuned!</p>
      <p className="mb-4 mt-8 text-center">Registration opens</p>

      <p className="mb-4 text-center text-[1.12rem] font-bold">{mapToUsDate(registrationDate)}</p>
    </>
  );
};

export default SoonModal;
