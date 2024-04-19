import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import {
  LessonWaitlistStatusesEnum,
  useUpsertLessonWaitlistMutation,
} from 'types/generated/client';
import CloseIcon from 'svg/CloseIcon';
import Modal, { ModalProps } from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props extends Omit<ModalProps, 'children'> {
  isOnWaitlist: boolean;
  handleComplete: () => void;
  userId?: string | null | undefined;
  lessonId: string;
}

const ModalWaitlist: React.FC<Props> = ({
  isOpen,
  handleClose,
  isOnWaitlist,
  handleComplete,
  userId,
  lessonId,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [upsertLessonWaitlistMutation, { loading: upsertWaitlistLoading }] =
    useUpsertLessonWaitlistMutation();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="p-6">
        <div className="flex justify-between">
          <ModalTitle>Waitlist</ModalTitle>
          <button
            className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          {isOnWaitlist ? (
            <div className="mt-4 leading-6">
              You are on the waitlist. If you would like to stop receiving notifications about this,
              you can remove yourself by pressing the button below.
            </div>
          ) : (
            <div className="mt-4 leading-6">
              This lesson is full. Join the waitlist, and we'll send you an email if a spot opens
              up. Spots are filled on a first-come, first-served basis.
            </div>
          )}
        </div>
        <div className="mt-6 flex w-full flex-col space-y-4">
          <button
            onClick={() => handleClose()}
            type="button"
            className="button-rounded-full-primary-inverted"
            disabled={upsertWaitlistLoading || isSubmitting}
          >
            Back
          </button>
          {isOnWaitlist ? (
            <button
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  await upsertLessonWaitlistMutation({
                    variables: {
                      lessonId,
                      userId,
                      status: LessonWaitlistStatusesEnum.Inactive,
                    },
                  });
                  await handleComplete();
                  handleClose();
                } catch (error) {
                  // @ts-ignore
                  toast.error(error.message);
                  Sentry.captureException(error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              type="button"
              className="button-rounded-full-background-bold"
              disabled={upsertWaitlistLoading || isSubmitting}
            >
              Leave waitlist
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  await upsertLessonWaitlistMutation({
                    variables: {
                      lessonId,
                      userId,
                      status: LessonWaitlistStatusesEnum.Active,
                    },
                  });
                  await handleComplete();
                  handleClose();
                } catch (error) {
                  // @ts-ignore
                  toast.error(error.message);
                  Sentry.captureException(error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              type="button"
              className="button-rounded-full-primary"
              disabled={upsertWaitlistLoading || isSubmitting}
            >
              Join waitlist
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalWaitlist;
