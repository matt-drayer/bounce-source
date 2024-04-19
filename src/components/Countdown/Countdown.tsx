import { FC } from 'react';
import ReactCountdown from 'react-countdown';

const Countdown: FC<{ date: Date }> = ({ date }) => {
  return (
    <ReactCountdown
      date={date}
      renderer={({ days, hours, minutes, seconds }) => {
        return (
          <div className="mx-auto flex max-w-[400px] justify-between text-brand-fire-500">
            <div className="flex h-[68px] w-[74px] flex-col items-center justify-center rounded-[6px] border border-brand-gray-50 bg-brand-gray-25">
              <span className="text-[1.5rem] font-semibold">{days}</span>
              <span className="text-[0.8rem] font-light">Days</span>
            </div>
            <div className="flex h-[68px] w-[74px] flex-col items-center justify-center rounded-[6px] border border-brand-gray-50 bg-brand-gray-25">
              <span className="text-[1.5rem] font-semibold">{hours}</span>
              <span className="text-[0.8rem] font-light">Hours</span>
            </div>
            <div className="flex h-[68px] w-[74px] flex-col items-center justify-center rounded-[6px] border border-brand-gray-50 bg-brand-gray-25">
              <span className="text-[1.5rem] font-semibold">{minutes}</span>
              <span className="text-[0.8rem] font-light">Minutes</span>
            </div>
            <div className="flex h-[68px] w-[74px] flex-col items-center justify-center rounded-[6px] border border-brand-gray-50 bg-brand-gray-25">
              <span className="text-[1.5rem] font-semibold">{seconds}</span>
              <span className="text-[0.8rem] font-light">Seconds</span>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Countdown;
