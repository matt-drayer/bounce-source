import * as React from 'react';
import { FC } from 'react';
import Marquee from 'react-fast-marquee';
import styled from 'styled-components';
import { ROOT_PAGE, TOURNAMENTS_PAGE } from 'constants/pages';
import { TournamentPreview } from 'constants/tournaments';
import LogoWithNameWhite from 'svg/LogoWithNameWhite';
import Footer from 'components/Footer';
import Link from 'components/Link';
import Benefits from 'components/tournaments/Benefits';
import Newsletter from 'components/tournaments/Newsletter';
import Partners from 'components/tournaments/Partners';
import PayersFeedback from 'components/tournaments/PayersFeedback';
import TournamentsList from 'components/tournaments/TournamentsList';
import Head from 'components/utilities/Head';
import colors from 'styles/colors.json';

const TournamentsPage: FC<{ tournaments: TournamentPreview[] }> = ({ tournaments = [] }) => {
  return (
    <>
      <Head
        noIndex
        title="Tournaments"
        description="Bounce pickleball tournnaments. Hit different."
      />
      <div className="relative flex h-[100vh] flex-col bg-[url('/images/tournaments/tournaments-header-bg.png')] bg-cover bg-no-repeat">
        <Gradient className="absolute bottom-0 z-10 h-full w-full" />
        <header className="relative z-20 flex justify-between pl-6 pr-6 pt-8 md:pl-16 md:pr-16">
          <Link href={ROOT_PAGE} className="flex items-center">
            <LogoWithNameWhite className="h-[1.8rem]" />
          </Link>
          <a
            href={TOURNAMENTS_PAGE}
            className="button-rounded-inline ml-5 flex h-[39px] w-full max-w-[172px] items-center justify-center border border-solid border-white text-[1rem] text-white sm:ml-0"
          >
            View tournaments
          </a>
        </header>
        <div className="relative z-20 mb-12 mt-auto max-w-[990px] flex-col pl-6 pr-6 pt-8 md:pl-16 md:pr-16">
          <h1 className="mb-11 text-center text-[2.5rem] font-light leading-snug text-white sm:text-left sm:text-[4rem]">
            Epic amateur <strong className="font-bold italic text-white">pickleball</strong>{' '}
            tournaments.
          </h1>
        </div>
      </div>
      <Marquee className="bg-brand-gray-100 pb-6 pt-4 sm:pb-12 sm:pt-8">
        <span className="text-[2.2rem] text-color-text-brand sm:text-[4rem]">
          <strong className="font-bold italic text-color-text-brand">Bounce </strong> Tournaments{' '}
          <strong className="font-bold italic text-color-text-brand">Hit </strong> Different.
        </span>
      </Marquee>
      <Benefits />
      <div className="flex flex-col bg-brand-gray-1000 pb-16 pl-6 pr-6 pt-10 md:pl-16 md:pr-16 md:pt-16">
        <h2 className="mb-10 text-[2.5rem] font-light leading-snug text-white sm:text-[4rem]">
          2023 <span className="font-medium italic">Tournaments</span>
        </h2>
        <TournamentsList tournaments={tournaments} />
      </div>
      <PayersFeedback />
      <Newsletter />
      <Partners />
      <Footer />
    </>
  );
};

const Gradient = styled.div`
  background: linear-gradient(
    194deg,
    rgba(255, 66, 41, 0) 34%,
    ${colors.paletteBrandFire.colors[600]} 100%
  );
`;

export default TournamentsPage;
