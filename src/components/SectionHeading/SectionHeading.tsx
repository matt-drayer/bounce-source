import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

const SectionHeading: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="font-bold leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:text-xl">{children}</h2>
  );
};

export default SectionHeading;
