import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

const FormSection: React.FC<Props> = ({ children }) => {
  return (
    <div className="justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:flex lg:border-b lg:py-6">
      {children}
    </div>
  );
};

export default FormSection;
