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
import LogoNav from 'svg/LogoNav';
import LogoWithName from 'svg/LogoWithName';
import BottomRegisterBar from 'components/BottomRegisterBar';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';

type Props = {
  isBottomRegister?: boolean;
  onSubmitSignup?: () => void;
  ignoreText?: string;
  ignoreAction?: () => void;
  isBottomBarRegisterMobile?: boolean;
};

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
          <div className="flex items-center">
            <Link href={ROOT_PAGE} className="" aria-label="Home">
              <LogoNav className="h-6 text-color-text-darkmode-primary" />
            </Link>
          </div>
          <div className="flex flex-col space-y-6 text-brand-gray-200 md:flex-row md:space-x-20 md:space-y-0">
            {/* <div>
            <div>
              <div>Join the chat</div>
            </div>
            <div className="mt-4 md:mt-5">
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-3xl border border-brand-gray-200 py-3 px-7"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.8467 3.5532C11.96 3.13987 11 2.83987 10 2.66653C9.99123 2.66625 9.98251 2.6679 9.97444 2.67136C9.96638 2.67481 9.95917 2.67999 9.95333 2.68653C9.83333 2.90653 9.69333 3.1932 9.6 3.4132C8.53933 3.2532 7.46066 3.2532 6.4 3.4132C6.30666 3.18653 6.16666 2.90653 6.04 2.68653C6.03333 2.6732 6.01333 2.66653 5.99333 2.66653C4.99333 2.83987 4.04 3.13987 3.14666 3.5532C3.14 3.5532 3.13333 3.55987 3.12666 3.56653C1.31333 6.27987 0.81333 8.91987 1.06 11.5332C1.06 11.5465 1.06666 11.5599 1.08 11.5665C2.28 12.4465 3.43333 12.9799 4.57333 13.3332C4.59333 13.3399 4.61333 13.3332 4.62 13.3199C4.88666 12.9532 5.12666 12.5665 5.33333 12.1599C5.34666 12.1332 5.33333 12.1065 5.30666 12.0999C4.92666 11.9532 4.56666 11.7799 4.21333 11.5799C4.18666 11.5665 4.18666 11.5265 4.20666 11.5065C4.28 11.4532 4.35333 11.3932 4.42666 11.3399C4.44 11.3265 4.46 11.3265 4.47333 11.3332C6.76666 12.3799 9.24 12.3799 11.5067 11.3332C11.52 11.3265 11.54 11.3265 11.5533 11.3399C11.6267 11.3999 11.7 11.4532 11.7733 11.5132C11.8 11.5332 11.8 11.5732 11.7667 11.5865C11.42 11.7932 11.0533 11.9599 10.6733 12.1065C10.6467 12.1132 10.64 12.1465 10.6467 12.1665C10.86 12.5732 11.1 12.9599 11.36 13.3265C11.38 13.3332 11.4 13.3399 11.42 13.3332C12.5667 12.9799 13.72 12.4465 14.92 11.5665C14.9333 11.5599 14.94 11.5465 14.94 11.5332C15.2333 8.5132 14.4533 5.8932 12.8733 3.56653C12.8667 3.55987 12.86 3.5532 12.8467 3.5532ZM5.68 9.93987C4.99333 9.93987 4.42 9.30653 4.42 8.52653C4.42 7.74653 4.98 7.1132 5.68 7.1132C6.38666 7.1132 6.94666 7.7532 6.94 8.52653C6.94 9.30653 6.38 9.93987 5.68 9.93987ZM10.3267 9.93987C9.64 9.93987 9.06666 9.30653 9.06666 8.52653C9.06666 7.74653 9.62666 7.1132 10.3267 7.1132C11.0333 7.1132 11.5933 7.7532 11.5867 8.52653C11.5867 9.30653 11.0333 9.93987 10.3267 9.93987Z"
                    fill="currentColor"
                  />
                </svg>

                <span className="ml-4">Discord</span>
              </a>
            </div>
          </div> */}
            <div className="flex items-center">
              <div className="flex items-center space-x-8">
                <div>
                  <Link className="text-color-text-darkmode-primary" href={TERMS_PAGE}>
                    Terms
                  </Link>
                </div>
                <div>
                  <Link className="text-color-text-darkmode-primary" href={PRIVACY_PAGE}>
                    Privacy
                  </Link>
                </div>
                <div>
                  <Link className="text-color-text-darkmode-primary" href={BLOG_PAGE}>
                    Blog
                  </Link>
                </div>
                <div>
                  <Link
                    className="text-color-text-darkmode-primary"
                    href={getCountryCourtsPageUrl(ACTIVE_COUNTRIES[0].slug)}
                  >
                    All Courts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex flex-col space-y-8 border-t border-brand-gray-800 pt-8 md:flex-row md:justify-between md:space-y-0">
          <div className="text-color-text-darkmode-tertiary">
            © {new Date().getFullYear()} Bounce. All rights reserved.
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <Link
                  isExternal
                  href="mailto:team@bounce.game"
                  className="text-color-text-darkmode-tertiary"
                >
                  team@bounce.game
                </Link>
              </div>
              <div className="flex shrink-0 items-center space-x-4 text-color-text-darkmode-primary">
                <a
                  className="shrink-0 text-color-text-darkmode-primary"
                  href={COMPANY_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.04 0H0.96C0.429 0 0 0.429 0 0.96V23.04C0 23.571 0.429 24 0.96 24H23.04C23.571 24 24 23.571 24 23.04V0.96C24 0.429 23.571 0 23.04 0ZM7.119 20.451H3.558V8.997H7.119V20.451ZM5.34 7.431C4.93178 7.431 4.53273 7.30995 4.1933 7.08315C3.85388 6.85636 3.58933 6.534 3.43311 6.15686C3.27689 5.77971 3.23602 5.36471 3.31566 4.96433C3.3953 4.56396 3.59188 4.19619 3.88053 3.90753C4.16919 3.61888 4.53696 3.4223 4.93733 3.34266C5.33771 3.26302 5.75271 3.30389 6.12986 3.46011C6.507 3.61633 6.82936 3.88088 7.05615 4.2203C7.28295 4.55973 7.404 4.95878 7.404 5.367C7.401 6.507 6.477 7.431 5.34 7.431ZM20.451 20.451H16.893V14.88C16.893 13.551 16.869 11.844 15.042 11.844C13.191 11.844 12.906 13.29 12.906 14.784V20.451H9.351V8.997H12.765V10.563H12.813C13.287 9.663 14.448 8.712 16.182 8.712C19.788 8.712 20.451 11.085 20.451 14.169V20.451Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  className="shrink-0 text-color-text-darkmode-primary"
                  href={COMPANY_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.00006 5.3333C7.29282 5.3333 6.61454 5.61425 6.11445 6.11435C5.61435 6.61445 5.3334 7.29272 5.3334 7.99997C5.3334 8.70721 5.61435 9.38549 6.11445 9.88558C6.61454 10.3857 7.29282 10.6666 8.00006 10.6666C8.70731 10.6666 9.38559 10.3857 9.88568 9.88558C10.3858 9.38549 10.6667 8.70721 10.6667 7.99997C10.6667 7.29272 10.3858 6.61445 9.88568 6.11435C9.38559 5.61425 8.70731 5.3333 8.00006 5.3333Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.8 0C3.52696 0 2.30606 0.505713 1.40589 1.40589C0.505713 2.30606 0 3.52696 0 4.8V11.2C0 12.473 0.505713 13.6939 1.40589 14.5941C2.30606 15.4943 3.52696 16 4.8 16H11.2C12.473 16 13.6939 15.4943 14.5941 14.5941C15.4943 13.6939 16 12.473 16 11.2V4.8C16 3.52696 15.4943 2.30606 14.5941 1.40589C13.6939 0.505713 12.473 0 11.2 0H4.8ZM4.26667 8C4.26667 7.00986 4.66 6.06027 5.36014 5.36014C6.06027 4.66 7.00986 4.26667 8 4.26667C8.99014 4.26667 9.93973 4.66 10.6399 5.36014C11.34 6.06027 11.7333 7.00986 11.7333 8C11.7333 8.99014 11.34 9.93973 10.6399 10.6399C9.93973 11.34 8.99014 11.7333 8 11.7333C7.00986 11.7333 6.06027 11.34 5.36014 10.6399C4.66 9.93973 4.26667 8.99014 4.26667 8ZM11.7333 4.26667H12.8V3.2H11.7333V4.26667Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
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
