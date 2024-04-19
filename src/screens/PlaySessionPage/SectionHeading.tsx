import React from 'react';

interface Props {
  children: React.ReactNode;
}

const SectionHeading: React.FC<Props> = ({ children }) => {
  return (
    <div className="text-lg font-bold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
      {children}
    </div>
  );
};

export default SectionHeading;
