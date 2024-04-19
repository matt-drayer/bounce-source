import React from 'react';
import Link from 'components/Link';
import Contact from '../TournamentMarketPlace/ContactForm/ContactModal';

export default function CTA() {
  return (
    <div className="z-[1] flex flex-col justify-center overflow-hidden bg-color-bg-lightmode-primary pt-[10.5rem] dark:bg-color-bg-darkmode-primary sm:pt-0 md:flex-row md:pt-[10.5rem]">
      <div className="flex flex-col items-center justify-center self-stretch pb-0 pl-0 pl-20 pt-24 md:items-start md:gap-8">
        <div className="flex flex-col items-center justify-center md:items-start">
          <h1 className="typography-informative-display-secondary text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Ready to <br />
            <span className="typography-informative-display-primary">get started?</span>{' '}
          </h1>
          <p className="typography-informative-subheading mt-4 w-2/3 text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary md:text-start">
            Organizing pickleball events has never been so easy.
          </p>
        </div>
        <div className="z-[999]">
          <Contact isCTA={true} title={''} />
        </div>
      </div>
      <img src="images/page/Card_7.png" className="h-auto max-w-full" alt="Card 7" />
    </div>
  );
}
