import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import { GetLessonParticipantOrderDetailsQuery } from 'types/generated/client';
import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import api from 'services/client/api';
import { convertMinutesToHours } from 'utils/shared/time/convertMinutesToHours';
import { useViewer } from 'hooks/useViewer';
import CheckCircle from 'svg/CheckCircle';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  playSessionId: string;
  handleJoinComplete: () => void;
}

const ModalJoin: React.FC<Props> = ({ isOpen, setIsOpen, playSessionId, handleJoinComplete }) => {
  const viewer = useViewer();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="p-6">
          <ModalTitle>Join play session</ModalTitle>
          <div className="mt-6 space-y-6">
            <div className="flex">
              <div className="h-5 w-5 text-color-success">
                <CheckCircle />
              </div>
              <div className="ml-3 text-sm leading-5">
                Join now to add yourself to the play session
              </div>
            </div>
            <div className="text-sm leading-5 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
              If you need to cancel, please do so at least 24 hours before the play session starts.
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
                    await api.post(`v1/play-sessions/${playSessionId}/participant/join`, {
                      payload: {
                        playSessionId,
                      },
                    });
                    handleJoinComplete();
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
                Join Now
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalJoin;
