import React, { useEffect, useState } from 'react';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import styled from 'styled-components';
import { SIGNUP_CODE_PAGE, TOURNAMENTS_PAGE } from 'constants/pages';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import BounceAppSection from './BounceAppSection';
import CTASection from './CTASection';
import CitiesSection from './CitiesSection';
import DinkSection from './DinkSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import Header from './Header';
import TournamentFormatSection from './TournamentFormatSection';

export default function BounceTourPage() {
  return (
    <>
      <Head
        title="Bounce Pickleball Tour and Tournaments"
        description="Played by amateurs, covered like the pros. Bounce hosts the leading amateur pickleball tournaments and tour. The Bounce Tour is covered by The Dink. Players will be featured in interviews, blog series, the newsletter and more."
      />
      <main className="min-h-screen">
        <Header />
        <div className="relative hidden min-h-screen bg-cover bg-center bg-no-repeat md:block">
          <video className="absolute h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src="/videos/header-video.mp4" type="video/mp4" />
          </video>
          <Gradient className="absolute left-0 top-0 min-h-screen">
            <div className="flex flex-col items-center justify-center pb-12 pt-32">
              <div className="flex items-center justify-center px-6 pb-12 text-center text-color-text-darkmode-primary sm:w-full sm:pl-16 sm:pr-0">
                <div className="w-3/4">
                  <h2 className="flex flex-col text-6xl italic leading-[120%] text-color-text-darkmode-primary md:block">
                    <span>The</span>
                  </h2>
                  <h1 className="mt-4 text-6xl font-bold italic text-color-text-darkmode-primary">
                    professional tour for amateur players
                  </h1>
                  <div className="space mt-8 space-y-8 text-2xl leading-none">
                    <div className="flex items-center justify-center ">
                      <Link
                        href={SIGNUP_CODE_PAGE}
                        className="button-rounded-inline-background-bold min-w-auto ml-4 flex h-auto w-full items-center justify-center px-4 py-3 text-sm font-normal md:w-auto"
                      >
                        Register now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Gradient>
        </div>
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat md:hidden">
          <video className="absolute h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src="/videos/header-video.mp4" type="video/mp4" />
          </video>
          <Gradient className="absolute left-0 top-0 min-h-screen">
            <div className="flex flex-col items-center justify-center pb-12 pt-32">
              <div className="flex items-center justify-center px-6 pb-12 text-center text-color-text-darkmode-primary sm:w-full sm:pl-16 sm:pr-0">
                <div className="w-3/4">
                  <h2 className="flex flex-col text-6xl italic leading-[120%] text-color-text-darkmode-primary md:block">
                    <span>The</span>
                  </h2>
                  <h2 className="mt-4 text-4xl font-bold italic text-color-text-darkmode-primary">
                    professional tour for amateur players
                  </h2>
                  <div className="space mt-8 space-y-8 text-2xl leading-none">
                    <div className="flex items-center justify-center ">
                      <Link
                        href={SIGNUP_CODE_PAGE}
                        className="button-rounded-inline-background-bold min-w-auto ml-4 flex h-auto w-full items-center justify-center px-4 py-3 text-sm font-normal md:w-auto"
                      >
                        Register now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Gradient>
        </div>
      </main>
      <CitiesSection />
      <div className="md:hidden">
        <BounceAppSection />
        <TournamentFormatSection />
      </div>
      <div className="hidden md:block">
        <TournamentFormatSection />
        <BounceAppSection />
      </div>
      <DinkSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </>
  );
}

const Gradient = styled.div`
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.05) 0%,
    // Adjusted opacity to 0.05
    rgba(0, 0, 0, 0.3) 100% // Adjusted opacity to 0.3
  );
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
