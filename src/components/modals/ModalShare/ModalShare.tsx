import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import CloseIcon from 'svg/CloseIcon';
import { Button } from 'components/Button';
import Modal from 'components/modals/Modal';

interface Props {
  isOpen: boolean;
  closeModal: (value: boolean) => void;
  shareUrl: string;
  title: string;
  buttonText?: string;
}

export default function ModalShare({
  isOpen,
  closeModal,
  shareUrl,
  title,
  buttonText = 'Copy link',
}: Props) {
  return (
    <Modal isOpen={isOpen} handleClose={() => closeModal(false)}>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {title}
          </h3>
          <button
            className="p-0.5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => closeModal(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          <div className="flex justify-center py-8">
            <QRCode value={shareUrl} size={128} />
          </div>
          <div className="flex w-full flex-col space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                try {
                  copy(shareUrl);
                  toast.success('Link copied');
                } catch (error) {
                  Sentry.captureException(error);
                  toast.error('Could not copy');
                }
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
