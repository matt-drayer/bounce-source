import React from 'react';
import { Dialog } from '@headlessui/react';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import QRCode from 'react-qr-code';
import Modal from 'components/modals/Modal';

interface Props {
  title: string;
  qrCodeString: string;
}

const QrFloatingButton: React.FC<Props> = ({ title, qrCodeString }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex w-full justify-end">
        <div className="pb-5 pr-5">
          <button
            className="floating-action-button-primary"
            onClick={() => setIsModalOpen(!isModalOpen)}
            type="button"
          >
            <QrCodeIcon className="h-6 w-6 text-color-text-darkmode-primary" />
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
              >
                {title}
              </Dialog.Title>
              <div className="mt-4 flex justify-center">
                <QRCode value={qrCodeString} />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="button-rounded-full-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QrFloatingButton;
