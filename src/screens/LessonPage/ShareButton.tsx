import * as React from 'react';
import Share from 'svg/Share';
import ModalShare from './ModalShare';

const ShareButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        className="button-rounded-inline-primary -mr-1 inline-flex items-center px-4 text-xs font-semibold lg:mr-1 lg:px-6 lg:py-3"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Share className="mr-2 w-4 text-base" /> Invite
      </button>
      <ModalShare isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ShareButton;
