import * as React from 'react';
import InfoCircle from 'svg/InfoCircle';

interface Props {
  children: React.ReactNode;
}

const InfoBox: React.FC<Props> = ({ children }) => {
  return (
    <div className="mt-4 flex rounded-md bg-color-brand-active px-4 py-3 text-sm text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
      <div className="mr-2">
        <InfoCircle className="h-5 w-5" />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoBox;
