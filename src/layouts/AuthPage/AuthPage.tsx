import * as React from 'react';

interface Props {
  children: React.ReactNode;
  sideContent: React.ReactNode;
}

const AuthPage: React.FC<Props> = ({ children, sideContent }) => {
  return (
    <div className="h-safe-screen safearea-pad-y flex grow flex-col lg:flex-row">
      <div className="hidden grow flex-col justify-center bg-color-bg-darkmode-primary lg:flex lg:w-1/2">
        {sideContent}
      </div>
      <div className="flex grow flex-col lg:w-1/2">{children}</div>
    </div>
  );
};

export default AuthPage;
