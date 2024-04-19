import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import ArrowUpCircle from 'svg/ArrowUpCircle';
import classNames from 'styles/utils/classNames';

interface Props {
  questionsAnswers: { question: string; answer: string }[];
}

export default function Faqs({ questionsAnswers }: Props) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="px-4 lg:px-0">
      <h2 className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        FAQ
      </h2>
      <div className="mt-4 space-y-4">
        {questionsAnswers.map((qa, idx) => {
          const isOpen = idx === openIndex;

          return (
            <Disclosure key={idx} as="div">
              {() => (
                <div
                  className={classNames(
                    'rounded-2xl p-8 transition-colors',
                    isOpen && 'bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary',
                  )}
                >
                  <Disclosure.Button
                    onClick={() => setOpenIndex((currentId) => (idx === currentId ? null : idx))}
                    className="flex w-full justify-between"
                  >
                    <span className="typography-product-subheading text-left">{qa.question}</span>
                    <ArrowUpCircle
                      className={classNames(
                        'h-5 w-5 shrink-0 transition-all duration-300',
                        isOpen
                          ? 'text-color-bg-lightmode-brand'
                          : 'rotate-180 transform text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon',
                      )}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    static
                    className={classNames(
                      'typography-product-body mt-2 grid text-color-text-lightmode-secondary transition-all dark:text-color-text-darkmode-secondary',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">{qa.answer}</div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
}
