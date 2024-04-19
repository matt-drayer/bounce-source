import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { getLessonPageUrl } from 'constants/pages';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ModalShare: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const lessonPath = getLessonPageUrl(router.query.lessonId as string);
  const lessonUrl = `${process.env.APP_URL}${lessonPath}`;

  return (
    <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Share lesson
          </h3>
          <button
            className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          <div className="flex justify-center py-8">
            <QRCode value={lessonUrl} size={128} />
          </div>
          <div className="flex w-full flex-col space-y-4">
            <button
              onClick={() => {
                try {
                  copy(lessonUrl);
                  toast.success('Lesson link copied');
                } catch (error) {
                  Sentry.captureException(error);
                  toast.error('Could not copy');
                }
              }}
              className="button-rounded-full-primary"
              type="button"
            >
              Copy lesson link
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalShare;
