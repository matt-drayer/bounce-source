import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import api from 'services/client/api';
import { convertMinutesToHours } from 'utils/shared/time/convertMinutesToHours';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  playSessionId: string;
  handleCancelComplete: () => void;
  startTimeDifferenceMinutes: number;
}

const ModalPlayerCancelPrompt: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  playSessionId,
  handleCancelComplete,
  startTimeDifferenceMinutes,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const timeDifferenceDisplay = convertMinutesToHours(startTimeDifferenceMinutes).toFixed(1);

  return (
    <>
      <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="p-6">
          <ModalTitle>Cancellation policy</ModalTitle>
          <div className="mt-6 space-y-6">
            <div className="text-base leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              There are {timeDifferenceDisplay} hours until your play session. We ask that you
              always try to cancel at least 24 hours before the play session so your fellow
              participants have time to adjust their schedules if needed.
            </div>
            <div className="flex w-full flex-col space-y-4">
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="button-rounded-full-primary-inverted"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await api.post(`v1/play-sessions/${playSessionId}/participant/leave`, {
                      payload: {
                        playSessionId,
                      },
                    });
                    handleCancelComplete();
                  } catch (error) {
                    // @ts-ignore
                    toast.error(error.message);
                    Sentry.captureException(error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                type="button"
                className="button-rounded-full-primary"
                disabled={isLoading}
              >
                Cancel now
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalPlayerCancelPrompt;
