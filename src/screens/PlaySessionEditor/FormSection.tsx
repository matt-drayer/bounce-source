import * as React from 'react';
import classNames from 'styles/utils/classNames';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={classNames(
        'justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:flex lg:border-b lg:py-6',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FormSection;
