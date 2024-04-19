import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE } from 'constants/pages';
import { PostRequestPayload } from 'constants/payloads/championWaitlist';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { useApiGateway } from 'hooks/useApi';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import MailIcon from 'svg/MailIcon';
import Plus from 'svg/Plus';
import { Button, ButtonText } from 'components/Button';
import Modal from 'components/modals/Modal/Modal';
import classNames from 'styles/utils/classNames';
import SuccessModal from './SuccessModal';

interface ContactModalProps {
  isCTA: boolean;
  title: string;
}

export default function ContactModal({ isCTA, title }: ContactModalProps) {
  const currentUser = useGetCurrentUser();
  const user = currentUser?.user;
  const { isOpen, openModal, closeModal, toggleModal } = useModal();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled = requestStatus === RequestStatus.InProgress;
  const { post } = useApiGateway<PostRequestPayload>('/v1/champion/tournament-organizer');

  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [user?.email, user?.fullName]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setError(null);
  };

  return (
    <>
      <div className="items-center md:flex">
        {!isCTA ? (
          <Button
            variant="secondary"
            className="px-ds-lg py-2 "
            iconLeft={<Plus className="h-5 w-5" />}
            size="md"
            onClick={() => openModal()}
          >
            {title}
          </Button>
        ) : (
          <div className="flex h-[3.5rem] w-[12rem] items-center justify-center px-3 py-4">
            <Button
              variant="brand"
              size="md"
              onClick={() => openModal()}
              className="button-rounded-inline-background-bold typography-product-button-label-large px-[0.5rem] py-[1rem]"
            >
              Get started
            </Button>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={closeModal}
        classNameRounded="rounded-t-3xl sm:rounded-2xl"
        classNamePosition="relative"
        classNameMaxWidth="max-w-xl"
      >
        <form
          className="relative flex grow flex-col items-center lg:justify-center"
          onSubmit={async (e) => {
            e.preventDefault();

            if (
              requestStatus === RequestStatus.InProgress ||
              requestStatus === RequestStatus.Success
            ) {
              return;
            }

            setRequestStatus(RequestStatus.InProgress);
            setError(null);

            await post({
              payload: {
                name,
                email,
              },
            });
            setRequestStatus(RequestStatus.Success);
            closeModal();
            resetForm();
          }}
        >
          <div className="absolute right-0 top-0 mr-4 mt-4">
            <ButtonText onClick={() => closeModal()} className="p-2">
              <CloseIcon className="h-6 w-6" />
            </ButtonText>
          </div>
          <div className="px-6 sm:px-24">
            <div className="flex w-full grow flex-col items-center lg:h-auto lg:grow-0">
              <div
                className={classNames(
                  'flex h-full w-full grow flex-col items-center justify-center transition-opacity duration-700',
                )}
              >
                <div className="mt-10 flex shrink-0 items-center justify-center space-x-4 px-6 pt-3">
                  <span className="text-2xl font-semibold">
                    <MailIcon />
                  </span>
                </div>
                <h2 className="typography-product-display mb-4 text-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Want your tournament on Bounce?
                </h2>
                <p className="typography-product-body mb-8 w-full px-6 text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  We’re providing early access to select clubs. Get in touch to be added to our
                  waitlist!
                </p>
                <div className="flex w-full flex-col space-y-8">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="name">
                      First and last name
                    </label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      type="text"
                      value={name}
                      onFocus={() => setError(null)}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    />
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  'mt-12 w-full shrink-0 pb-10 transition-opacity duration-700',
                )}
              >
                <button className="button-rounded-full-primary" type="submit" disabled={isDisabled}>
                  {isDisabled ? 'Submitting request...' : 'Send'}
                </button>
                <div className="mt-6 flex items-center justify-center text-center">
                  <ButtonText
                    className={classNames(
                      'typography-product-body-highlight text-color-text-brand',
                      isDisabled && 'opacity-50',
                    )}
                    onClick={() => !isDisabled && closeModal()}
                    disabled={isDisabled}
                  >
                    Go back
                  </ButtonText>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <SuccessModal
        isOpen={requestStatus === RequestStatus.Success}
        setRequestStatus={setRequestStatus}
        closeModal={closeModal}
      />
    </>
  );
}
