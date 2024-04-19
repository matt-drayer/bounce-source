import { FC } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {}

const benefits = [
  <div>
    Play at least <strong className="font-medium italic text-brand-fire-500">four matches</strong>{' '}
    with round robin + single elimination playoff format
  </div>,
  <div>
    Compete for substantial{' '}
    <strong className="font-medium italic text-brand-fire-500">prize money</strong> regardless of
    age, skill level or the event you enter
  </div>,
  <div>
    Track your performance over time as Bounce tournaments are{' '}
    <strong className="font-medium italic text-brand-fire-500">integrated with DUPR</strong>
  </div>,
  <div>
    Earn your way to the{' '}
    <strong className="font-medium italic text-brand-fire-500">invite-only</strong>,{' '}
    <strong className="font-medium italic text-brand-fire-500">regional</strong> and{' '}
    <strong className="font-medium italic text-brand-fire-500">national tournaments</strong> kicking
    off in 2024
  </div>,
];

const Benefits: FC<Props> = () => {
  return (
    <div className="flex flex-col-reverse bg-brand-gray-100 pb-16 pl-6 pr-6 md:pl-16 md:pr-16 lg:flex-row lg:pt-16">
      <div className="flex w-full flex-col justify-between">
        {benefits.map((text, index) => {
          return (
            <div
              className={classNames(
                'items flex items-center rounded-md bg-color-bg-lightmode-primary pb-6 pl-6 pr-6 pt-6 dark:bg-color-bg-darkmode-primary',
                {
                  'mb-6': index < benefits.length - 1,
                },
              )}
              key={index}
            >
              <div className="mr-6 flex h-[40px] w-[40px] shrink-0 items-center justify-center self-start rounded-[50%] bg-brand-fire-500">
                <img src="/images/tournaments/check.svg" alt="check" />
              </div>
              <div className="text-xl font-light">{text}</div>
            </div>
          );
        })}
      </div>
      <img
        src="/images/tournaments/bounce-tournament-1.jpg"
        alt="benefits"
        className="mb-12 max-w-[533px] rounded-lg blur-[0.5px] lg:m-0 lg:ml-5"
      />
    </div>
  );
};

export default Benefits;
