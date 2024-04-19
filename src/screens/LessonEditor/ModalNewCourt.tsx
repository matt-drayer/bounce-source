import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import {
  useGetUserAvailableLessonContentLazyQuery,
  useInsertUserCustomCourtMutation,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';

type Refetch = ReturnType<typeof useGetUserAvailableLessonContentLazyQuery>[1]['refetch'];

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  refetchLessonContent: Refetch;
  setCourtId: (courtId: string) => void;
}

const ModalNewCourt: React.FC<Props> = ({
  isOpen,
  handleClose,
  refetchLessonContent,
  setCourtId,
}) => {
  const viewer = useViewer();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [insertUserCustomCourtMutation, { loading }] = useInsertUserCustomCourtMutation();
  const [courtName, setCourtName] = React.useState('');
  const [fullAddress, setFullAddress] = React.useState('');
  const isDisabled = loading || isSubmitting;

  return (
    <Modal isOpen={isOpen} handleClose={() => handleClose()}>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Add new court
          </h3>
          <button
            className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </button>
        </div>
        <form
          className="mt-6"
          onSubmit={async (e) => {
            e.preventDefault();

            if (isSubmitting) {
              return;
            }

            if (!viewer.userId) {
              return;
            }

            if (!courtName.trim() || !fullAddress.trim()) {
              return;
            }

            setIsSubmitting(true);

            try {
              const resposne = await insertUserCustomCourtMutation({
                variables: {
                  customCourtData: {
                    userId: viewer.userId,
                    title: courtName.trim(),
                    fullAddress: fullAddress.trim(),
                  },
                },
              });
              setCourtId(resposne.data?.insertUserCustomCourtsOne?.id || '');
              await refetchLessonContent({
                id: viewer.userId,
              });
              handleClose();
            } catch (error) {
              Sentry.captureException(error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="space-y-4">
            <label htmlFor="lesson-court-name" className="sr-only">
              Court name
            </label>
            <div className="w-full lg:max-w-[520px]">
              <input
                id="lesson-court-name"
                name="lesson-court-name"
                type="text"
                placeholder="Court name"
                className="input-form py-[9px]"
                disabled={isDisabled}
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                required
              />
            </div>
            <label htmlFor="lesson-address-string" className="sr-only">
              Address
            </label>
            <div className="w-full lg:max-w-[520px]">
              <input
                id="lesson-address-string"
                name="lesson-address-string"
                placeholder="Court full address"
                type="text"
                className="input-form py-[9px]"
                disabled={isDisabled}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-8">
            <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalNewCourt;
