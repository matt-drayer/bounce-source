import React from 'react';
import CloseIcon from 'svg/CloseIcon';
import { ButtonText } from 'components/Button';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

interface ModalProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default function EmailModal({ isOpen, openModal, closeModal }: ModalProps) {
  const [error, setError] = React.useState<any | null>(null);

  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Values:', formValues);
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={closeModal}
      classNameRounded="rounded-t-3xl sm:rounded-2xl"
      classNamePosition="relative"
      classNameMaxWidth="max-w-2xl"
    >
      <form
        className="relative flex grow flex-col items-center p-7 pb-0 lg:justify-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="typography-product-heading mb-0 text-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Send Email
          </h2>
          <ButtonText onClick={closeModal} className="p-2">
            <CloseIcon className="h-6 w-6" />
          </ButtonText>
        </div>
        <div className="flex w-full grow flex-col items-center lg:h-auto lg:grow-0">
          <div
            className={classNames(
              'flex h-full w-full grow flex-col items-center justify-center gap-4 transition-opacity duration-700',
            )}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex w-1/2 flex-col gap-2">
                <label
                  htmlFor="name"
                  className="typography-product-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                >
                  To
                </label>
                <select
                  id="name"
                  name="name"
                  onFocus={() => setError(null)}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input-form"
                  required
                >
                  <option value="">All Players</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                </select>
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <label
                  htmlFor="email"
                  className="typography-product-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                >
                  From
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="cooperjosh89@gmail.com"
                  className="input-form"
                  required
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="subject"
                className="typography-product-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="subject"
                autoComplete="subject"
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Subject"
                className="input-form"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="message"
                className="typography-product-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                autoComplete="message"
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Enter your message"
                className="input-form"
                required
              />
            </div>
          </div>
          <div
            className={classNames(
              'mt-6 flex w-1/4 shrink-0 items-center pb-6 transition-opacity duration-700',
            )}
          >
            <button className="button-rounded-full-primary" type="submit">
              Send Email
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
