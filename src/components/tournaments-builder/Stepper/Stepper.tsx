import React from 'react';
import classNames from 'classnames';
import TournamentBuilderStep from 'svg/TournamentBuilderStep';

type Props = {
  steps: { title: string; description: string }[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <div className="relative flex w-full max-w-[1000px] items-center justify-between">
      {steps.map(({ title, description }, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        const titleClasses = classNames({
          'font-semibold': true,
          'text-color-text-lightmode-primary': !isActive,
          'text-color-text-brand': isActive,
        });

        const descClasses = classNames({
          'font-light': true,
          'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary': !isActive,
          'text-color-text-brand': isActive,
        });

        return (
          <div className="relative z-10 flex w-full flex-col items-center" key={index}>
            <div className="relative flex w-full justify-center">
              <TournamentBuilderStep active={isActive} completed={isCompleted} />
              {index < steps.length - 1 && (
                <div className="absolute top-[50%] -z-10 h-[1px] w-full -translate-y-1/2 translate-x-1/2 bg-color-border-input-lightmode"></div>
              )}
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className={titleClasses}>{title}</span>
              <span className={descClasses}>{description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
