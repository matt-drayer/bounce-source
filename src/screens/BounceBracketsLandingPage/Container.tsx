import React from 'react';
import Footer from 'components/Footer';
import CTA from './CTA';
import ForWhom from './ForWhom';
import ValuePropositions from './ValuePropositions';
import Contact from '../TournamentMarketPlace/ContactForm/ContactModal';

export default function Container() {
  return (
    <>
      <main className="flex flex-col items-center gap-8 ">
        <div>
          <div className="flex flex-col items-center self-stretch pt-24 md:pl-20 md:pr-20">
            <h1 className="typography-informative-display-mega-secondary text-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Seamless{' '}
              <span className="typography-informative-display-mega-primary">pickleball</span> <br />
              tournament software
            </h1>
            <p className="typography-informative-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              Simple. Reliable. Fun.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <Contact isCTA={true} title={''} />
          <img src="/images/page/Content.png" className="mt-4 w-full md:mt-0" />
        </div>
      </main>
      <ValuePropositions />
      <ForWhom />
      <CTA />
      <Footer />
    </>
  );
}
