import React from 'react';
import { Case, Switch } from 'react-if';
import Check from 'svg/Check';
import classNames from 'styles/utils/classNames';

interface IndicatorProps {
  isActive: boolean;
  children?: React.ReactNode;
}

const Dot: React.FC<IndicatorProps> = ({ isActive, children }) => (
  <div
    className={classNames(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
      isActive
        ? 'bg-color-brand-secondary'
        : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
    )}
  >
    {children}
  </div>
);

const Line: React.FC<IndicatorProps> = ({ isActive }) => (
  <div
    style={{ height: '1px' }}
    className={classNames(
      'shrink-0 grow',
      isActive
        ? 'bg-color-brand-secondary'
        : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
    )}
  >
    &nbsp;
  </div>
);

interface Props {
  currentStep: number;
  totalSteps: number;
}

const OnboardStepTracker: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const steps = new Array(totalSteps).fill(currentStep);
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((_step, index) => {
        return (
          <React.Fragment key={index}>
            {index > 0 && <Line isActive={currentStep >= index} />}
            <Dot isActive={currentStep >= index}>
              <Switch>
                <Case condition={currentStep > index}>
                  <Check className="w-[8px] text-color-text-darkmode-primary" />
                </Case>
                <Case condition={currentStep === index}>
                  <div className="h-[6px] w-[6px] rounded-full bg-color-text-darkmode-primary"></div>
                </Case>
              </Switch>
            </Dot>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OnboardStepTracker;
