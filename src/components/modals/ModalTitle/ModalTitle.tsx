import * as React from 'react';
import { Dialog } from '@headlessui/react';

interface Props {
  tabIndex?: number;
  children: React.ReactNode;
}

const ModalTitle: React.FC<Props> = ({ tabIndex = 0, children }) => {
  return (
    <Dialog.Title
      as="h3"
      tabIndex={tabIndex}
      className="text-2xl font-bold leading-7 text-color-text-lightmode-primary focus:outline-none dark:text-color-text-darkmode-primary"
    >
      {children}
    </Dialog.Title>
  );
};

export default ModalTitle;
