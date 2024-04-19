import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from 'svg/CloseIcon';

interface LightboxProps {
  items: React.ReactNode[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ items, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const prevItem = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  const nextItem = () => setCurrentIndex((prev) => (prev + 1) % items.length);

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-30 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />
          </Transition.Child>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <button type="button" className="absolute right-4 top-4" onClick={onClose}>
              <CloseIcon className="h-8 w-8 text-color-text-darkmode-primary" />
            </button>

            <div className="my-8 inline-block w-full transform overflow-hidden text-left align-middle shadow-xl transition-all">
              {items[currentIndex]}

              {items.length > 1 && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={prevItem}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextItem}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
