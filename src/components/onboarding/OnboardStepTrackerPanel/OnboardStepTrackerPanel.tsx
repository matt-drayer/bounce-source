import * as React from 'react';
import { Case, Switch } from 'react-if';
import Check from 'svg/Check';
import LogoWithNameWhite from 'svg/LogoWithNameWhite';
import classNames from 'styles/utils/classNames';

interface IndicatorProps {
  isActive: boolean;
  children?: React.ReactNode;
}

const Dot: React.FC<IndicatorProps> = ({ isActive, children }) => (
  <div
    className={classNames(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
      isActive ? 'bg-color-brand-secondary' : 'bg-brand-gray-700',
    )}
  >
    {children}
  </div>
);

const Line: React.FC<IndicatorProps> = ({ isActive }) => (
  <div
    className={classNames(
      'ml-[7.5px] h-[5.5rem] w-[1px] shrink-0 grow',
      isActive ? 'bg-color-brand-secondary' : 'bg-brand-gray-700',
    )}
  >
    &nbsp;
  </div>
);

interface Props {
  currentStep: number;
  steps: { name: string; url: string }[];
}

const OnboardStepTrackerPanel: React.FC<Props> = ({ currentStep, steps }) => {
  return (
    <div className="flex h-full grow flex-col bg-color-bg-darkmode-primary pl-16">
      <div className="pt-16">
        <LogoWithNameWhite className="h-7" />
      </div>
      <div className="mt-36">
        <div className="flex flex-col">
          {steps.map((step, index) => {
            return (
              <React.Fragment key={index}>
                {index > 0 && <Line isActive={currentStep >= index} />}
                <div className="flex items-center">
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
                  <div
                    className={classNames(
                      'ml-6 text-sm leading-none',
                      index === currentStep
                        ? 'text-color-text-darkmode-tertiary'
                        : 'text-color-text-darkmode-inactive',
                    )}
                  >
                    {step.name}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardStepTrackerPanel;
