import React from 'react';

interface Props {
  children: React.ReactNode;
}

const CardError: React.FC<Props> = ({ children }) => {
  return (
    <div className="mb-4 w-full rounded-md border border-color-error p-4 text-center text-sm text-color-error">
      {children}
    </div>
  );
};

export default CardError;
