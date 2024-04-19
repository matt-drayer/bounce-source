import * as React from 'react';

interface Props {
  onboardSteps: React.ReactNode;
  children: React.ReactNode;
}

const OnboardingPage: React.FC<Props> = ({ children, onboardSteps }) => {
  return (
    <div className="h-safe-screen flex grow flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-1/3">{onboardSteps}</div>
      <div className="h-safe-screen flex grow flex-col lg:w-2/3">{children}</div>
    </div>
  );
};

export default OnboardingPage;
