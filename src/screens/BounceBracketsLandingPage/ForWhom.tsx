import React, { useEffect, useState } from 'react';
import CheckIcon from 'svg/CheckIcon';
import classNames from 'styles/utils/classNames';

const data = {
  title: 'Organized play that',
  description:
    'Bounce simplifies every event, from open play to tournaments, ensuring a seamless experience for both organizers and players.',
  image: '/images/page/Card_6.1.png',
};

export default function ForWhom() {
  return (
    <>
      <div className="hidden md:block">
        <div className="flex-col items-center gap-[1.15rem] gap-[2rem] self-stretch bg-color-bg-darkmode-primary pb-0 pl-20 pr-20 pt-24 dark:bg-color-bg-lightmode-primary md:flex">
          <h2 className="typography-informative-display-secondary-desktop md:typography-informative-display-secondary text-center text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
            No more headaches <br />
            <span className="typography-informative-display-primary text-color-text-brand dark:text-color-text-brand">
              on gameday.
            </span>
          </h2>
          <div className="flex flex-col-reverse items-center items-center justify-center justify-center md:flex-row">
            <div className="flex h-full w-full items-center justify-center md:relative">
              <img src="/images/page/blur.png" />
              <img src={data.image} className="top-[2.25rem] block w-[90%] md:absolute" />
            </div>
            <div className="mb-6 ml-4 flex-col justify-center gap-3 md:flex">
              <p className="font-inter typography-informative-heading text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
                {data.title}
                <br />
                runs itself.
              </p>
              <p className="typography-informative-subheading w-2/3 text-color-text-lightmode-disabled dark:text-color-text-darkmode-disabled">
                {data.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-center items-center justify-center justify-center bg-color-bg-darkmode-primary pt-8 dark:bg-color-bg-lightmode-primary md:hidden">
        <div className="flex flex-col items-center justify-center md:hidden">
          <h2 className="typography-informative-display-secondary-mobile text-center text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
            No more headaches <br />
            <span className="typography-informative-display-primary-mobile text-color-text-brand dark:text-color-text-brand">
              on gameday.
            </span>
          </h2>
          <img src={data.image} />
        </div>
      </div>
    </>
  );
}
