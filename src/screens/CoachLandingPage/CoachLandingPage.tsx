import * as React from 'react';
import styled from 'styled-components';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE, SIGNUP_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import ContactForm from 'components/ContactForm';
import Footer from 'components/Footer';
import Link from 'components/Link';
import TopNav from 'components/nav/TopNav';
import Head from 'components/utilities/Head';
import PopppinsFont from 'components/utilities/PoppinsFont';
import { mobile, tablet } from 'styles/breakpoints';
import colors from 'styles/colors.json';
import CoachFeedbackCarousel from './CoachFeedbackCarousel';
import HowItWorks from './HowItWorks';

const CoachesLandingPage = () => {
  const viewer = useViewer();
  const isAnonymous = viewer?.status === AuthStatus.Anonymous;

  return (
    <>
      <Head
        title="Pickleball Coaches"
        description="Bounce players with coaches and allows you to manage all your lessons on a single platform. Get your game on. Built for pickleball players of any skill level."
      />
      <PopppinsFont />
      <TopNav
        shouldShowMobile
        shouldLinkToAuthPage
        shouldShowAdditionalLinks
        shouldShowStartAction
        shouldHideNavigation={false}
        isBlur
      />
      <main className="min-h-screen">
        {/* <CoachLandingDownloadApp /> */}
        <HowItWorks />
        <div className="bg-color-bg-lightmode-secondary px-gutter-base py-32 dark:bg-color-bg-darkmode-secondary">
          <MiddlemanSection className="mt-15 relative mx-auto flex max-w-[1200px] flex-col items-center px-gutter-base pb-16 pt-14">
            <img src="/images/tour-page/ball-4.png" className="ball-4" />
            <img src="/images/tour-page/ball-5.png" className="ball-5" />

            <div className="flex flex-col items-center">
              <div className="justify-center px-gutter-base">
                <h2 className="text-center font-family-poppins text-4xl font-bold leading-tight text-color-text-darkmode-primary md:text-3xl">
                  No more middlemen
                </h2>
                <p className="mt-6 text-center font-light text-color-text-darkmode-tertiary md:text-lg lg:mx-auto lg:w-[80%]">
                  We’re making racket sports more accessible by giving players and coaches a
                  seamless way to connect for lessons. It’s time to stop relying on gated websites
                  and apps.{' '}
                </p>
              </div>
            </div>
            <div className="mt-8 flex w-full justify-center px-gutter-base">
              <Link
                href={isAnonymous ? SIGNUP_PAGE : HOME_PAGE}
                className="button-rounded-inline-background-bold flex h-[56px] w-full max-w-[180px] items-center justify-center"
              >
                {isAnonymous ? 'Sign up' : 'Get started'}
              </Link>
            </div>
          </MiddlemanSection>
          <CoachFeedbackCarousel />
        </div>
        <CertifiedInstructor className="bg-brand-gray-900 px-6 pb-24 pt-24 lg:px-0">
          <div className="mx-auto flex max-w-[1200px] flex-col">
            <div className="mt-8 flex w-full flex-col items-center">
              <h2 className="text-[2rem] font-bold lg:text-[3.2rem]">
                Are you a Cardio Tennis or Triples instructor?
              </h2>
              <p className="mb-10 mt-5 text-center text-[1rem] text-brand-gray-100 lg:text-[1.2rem]">
                Become a certified Bounce instructor and give players an even better fitness
                experience.
              </p>

              <Link
                href={isAnonymous ? SIGNUP_PAGE : HOME_PAGE}
                className="button-rounded-inline-background-bold flex h-[56px] w-full max-w-[180px] items-center justify-center"
              >
                Learn more
              </Link>
            </div>
          </div>
          <Images className="relative mt-10 flex flex-col items-center lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
            <img src="/images/tour-page/advantage_players.png" alt="" className="left" />
            <img
              src="/images/tour-page/advantage_triples_1920.png"
              alt=""
              className="right mt-5 lg:mt-0"
            />
            <img src="/images/tour-page/basket-ball.svg" alt="" className="basket" />
          </Images>
        </CertifiedInstructor>
        {/* @todo use the new components Faqs */}
        {/*<LandingFaq />*/}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
};

const MiddlemanSection = styled.div`
  background: ${colors.paletteBrandBlue.colors[900]};
  border-radius: 16px;

  > img {
    position: absolute;
  }

  .ball-4 {
    right: -125px;
    top: -20px;
  }

  .ball-5 {
    left: -95px;
    bottom: -22px;
  }

  ${mobile()} {
    .ball-4 {
      right: 1%;
      top: -9em;
    }

    .ball-5 {
      max-width: 160px;
      bottom: -6em;
      left: 2em;
    }
  }
`;

const CertifiedInstructor = styled.div`
  h2 {
    color: #fff;
    line-height: 1.2;
    text-align: center;
  }
`;

const Images = styled.div`
  > img {
    width: 50%;
  }

  .basket {
    position: absolute;
    height: 5em;
    width: 5em;
    top: -5em;
    right: 20.7%;
  }

  ${tablet()} {
    > img {
      width: 100%;
    }

    .basket {
      bottom: 50%;
      top: initial;
      right: 40%;
    }
  }

  ${mobile()} {
    .basket {
      bottom: 55%;
      right: 44%;
      width: 30px;
      height: 30px;
    }
  }
`;

export default CoachesLandingPage;
