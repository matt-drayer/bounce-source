import React from 'react';
import CheckIcon from 'svg/CheckIcon';

export default function ValuePropositions() {
  return (
    <div className="flex flex-col items-center self-stretch bg-color-bg-darkmode-primary pb-0 pt-24 dark:bg-color-bg-lightmode-primary sm:pl-0 sm:pr-0">
      <div className="mb-8 hidden flex-col items-center md:flex">
        <h2 className="typography-informative-display-secondary text-center text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
          Pickleball events <br />
          just got{' '}
          <span className="typography-informative-display-primary text-color-text-brand dark:text-color-text-brand">
            better.
          </span>
        </h2>
      </div>
      <div className="mb-8 flex flex-col items-center md:hidden">
        <h2 className=" typography-informative-display-secondary text-center text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
          Pickleball events <br />
          just got{' '}
          <span className="typography-informative-display-primary text-color-text-brand dark:text-color-text-brand">
            better.
          </span>
        </h2>
      </div>
      <div className="flex flex-col items-center justify-between md:flex-row">
        {/*card 1*/}
        <div className="flex flex-col items-center justify-center gap-6 p-1">
          <img src="images/page/Card_1.png" />
        </div>
        {/*card 2*/}
        <div className="flex flex-col items-center justify-center gap-6 p-1">
          <img src="images/page/Card_3.png" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between md:flex-row">
        {/*card 3*/}
        <div className="flex flex-col items-center justify-center gap-6 p-1">
          <img src="images/page/Card_5.png" />
        </div>
        {/*card 4*/}
        <div className="flex flex-col items-center justify-center gap-6 p-1">
          <img src="images/page/Card_4.png" />
        </div>
     </div>
    </div>
  );
}
