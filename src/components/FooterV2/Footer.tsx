import * as React from 'react';
import { COMPANY_INSTAGRAM, COMPANY_LINKEDIN, DISCORD_LINK } from 'constants/internal';
import {
  ACTIVE_COUNTRIES,
  BLOG_PAGE,
  PRIVACY_PAGE,
  ROOT_PAGE,
  TERMS_PAGE,
  getCountryCourtsPageUrl,
} from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import FaceBookIcon from 'svg/FaceBookIcon';
import InstagramIcon from 'svg/InstagramIcon';
import LinkedInIcon from 'svg/LinkedInIcon';
import LogoNav from 'svg/LogoNav';
import LogoWithName from 'svg/LogoWithName';
import MoonIcon from 'svg/MoonIcon';
import SunIcon from 'svg/SunIcon';
import BottomRegisterBar from 'components/BottomRegisterBar';
import { Button, ButtonText } from 'components/Button/Button';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';

type Props = {
  isBottomRegister?: boolean;
  onSubmitSignup?: () => void;
  ignoreText?: string;
  ignoreAction?: () => void;
  isBottomBarRegisterMobile?: boolean;
  title: string;
  items: string[];
};

const FooterLink = ({ title, items }: Props) => (
  <div className="flex flex-col gap-4">
    <p className="typography-product-link text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
      {title}
    </p>
    {items.map((item, index) => (
      <Link href="#" key={index}>
        <ButtonText
          className="typography-product-caption text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder"
          style={{ justifyContent: 'start' }}
        >
          {item}
        </ButtonText>
      </Link>
    ))}
  </div>
);

export default function Footer({
  isBottomRegister,
  onSubmitSignup,
  ignoreText,
  ignoreAction,
  isBottomBarRegisterMobile,
}: Props) {
  const { isSessionLoading, isUserSession } = useViewer();

  return (
    <>
      <footer className="bg-color-bg-darkmode-primary px-4 py-8 sm:px-8">
        <div className="mx-auto flex flex-col space-y-8 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col justify-between">
            <Link href={ROOT_PAGE} className="" aria-label="Home">
              <LogoNav className="h-6 text-color-text-darkmode-primary" />
            </Link>
            <div className="hidden md:flex">
              <Button className="w-1/2" variant="primary">
                <MoonIcon className="h-6 w-6 text-white" />
              </Button>
              <Button className="w-1/2" variant="primary">
                <SunIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-20 md:flex-row">
            <div className="flex gap-20">
              <FooterLink title="Product" items={['Courts', 'Tournaments', 'Lessons']} />
              <FooterLink
                title="Cities"
                items={[
                  'Chicago',
                  'San Diego',
                  'New York',
                  'Boston',
                  'Dallas',
                  'Los Angeles',
                  'Philadelphia',
                ]}
              />
            </div>
            <div className="flex gap-20">
              <FooterLink
                title="Blog"
                items={['Pickleball at Maryland', 'Fromuth Fall Classic', 'Bounce Is Coming Back']}
              />
              <FooterLink
                title="Company"
                items={['About', 'Privacy Policy', 'Bounce Is Coming Back']}
              />
            </div>
          </div>
          <div>
            <Button
              size="md"
              variant="inverted"
              className="typography-product-button-label-medium border border-color-border-card-lightmode bg-transparent py-3 text-color-text-darkmode-invert text-color-text-lightmode-invert dark:border-color-border-card-darkmode"
            >
              Create a tournament
            </Button>
          </div>
          <div className="flex md:hidden">
            <div>
              <Button variant="primary" size="xs">
                <MoonIcon className="h-6 w-6 text-white" />
              </Button>
            </div>
            <div>
              <Button variant="primary" size="xs">
                <SunIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex flex-col-reverse gap-5 space-y-8 border-t border-brand-gray-800 pt-8 md:flex-row md:justify-between md:space-y-0">
          <div className="text-color-text-darkmode-tertiary">
            © {new Date().getFullYear()} Bounce. All rights reserved.
          </div>
          <div className="flex w-full justify-between md:items-center">
            <div className="mr-8">
              <Link
                isExternal
                href="mailto:team@bounce.game"
                className="text-color-text-darkmode-tertiary"
              >
                team@bounce.game
              </Link>
            </div>
            <div className="flex shrink-0 justify-between space-x-4 text-color-text-darkmode-primary md:items-center">
              <a
                className="shrink-0 text-color-text-darkmode-primary"
                href={COMPANY_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-6 w-6" />
              </a>
              <a
                className="shrink-0 text-color-text-darkmode-primary"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaceBookIcon className="h-6 w-6" />
              </a>
              <a
                className="shrink-0 text-color-text-darkmode-primary"
                href={COMPANY_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      {isBottomRegister && !isSessionLoading && !isUserSession && (
        <BottomRegisterBar
          isShowMobile={isBottomBarRegisterMobile}
          onSubmitSignup={onSubmitSignup}
          ignoreText={ignoreText}
          ignoreAction={ignoreAction}
        />
      )}
    </>
  );
}
