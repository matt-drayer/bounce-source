import React from 'react';
import { Dialog } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';

interface Props {
  title: string;
  qrCodeString: string;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default function InviteModal({ isOpen, closeModal, title, qrCodeString }: Props) {
  return (
    <>
      <Modal isOpen={isOpen} handleClose={closeModal}>
        <div className="relative">
          <button
            className="absolute right-5 top-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={closeModal}
          >
            <CloseIcon />
          </button>
          <div className="p-8">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                >
                  {title}
                </Dialog.Title>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <QRCode value={qrCodeString} size={160} />
            </div>
            <div className="mt-8 space-y-2">
              <button
                onClick={() => {
                  try {
                    copy(qrCodeString);
                    toast.success('Group link copied');
                  } catch (error) {
                    Sentry.captureException(error);
                    toast.error('Could not copy');
                  }
                }}
                className="button-rounded-full-primary"
                type="button"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
