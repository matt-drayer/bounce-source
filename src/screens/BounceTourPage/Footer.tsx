import * as React from 'react';
import styled from 'styled-components';
import { SIGNUP_CODE_PAGE } from 'constants/pages';
import Link from 'components/Link';

export default function Footer() {
  return (
    <>
      <div className="hidden bg-brand-gray-1000 p-20 pb-0 md:block">
        <div className="flex justify-between">
          <img src="/images/tour-page/bounce-logo.png" className="h-16" />
          <div className="hidden flex-col gap-5">
            <h2 className="text-color-text-darkmode-primary">Get the app</h2>
            <a href="app-store-link" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/tour-page/appStore.png"
                alt="App Store"
                className="h-10 w-full cursor-pointer"
              />
            </a>
            <a href="google-play-link" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/tour-page/GooglePlay.png"
                alt="Google Play"
                className="h-10 w-full cursor-pointer"
              />
            </a>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <img src="/images/tour-page/divider.png" />
        </div>
        <div className="flex justify-between gap-5 pb-5">
          <p className="text-color-text-darkmode-primary">
            © {new Date().getFullYear()} Bounce. All rights reserved.
          </p>
          <div className="flex gap-5">
            <p className="pb-5 text-color-text-darkmode-primary">team@bounce.game</p>
            <a
              href="insta-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/4 border-none outline-none"
            >
              <img src="/images/tour-page/insta-icon.png" className="h-5 w-5" />
            </a>
            <a
              href="linkedin-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/4 border-none outline-none"
            >
              <img src="/images/tour-page/linkedin-icon.png" className="h-5 w-5" />
            </a>
            <a
              href="x-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/4 border-none outline-none"
            >
              <img src="/images/tour-page/x-icon.png" className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/*mobile footer*/}
      <div className="block md:hidden">
        <div className="bg-brand-gray-1000 p-10">
          <img src="/images/tour-page/bounce-logo.png" className="mb-12 h-auto" />
          <div className="flex flex-col gap-8">
            <h2 className="hidden text-color-text-darkmode-primary">Get the app</h2>
            <div className="flex hidden gap-5">
              <a href="app-store-link" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/tour-page/appStore.png"
                  alt="App Store"
                  className="h-10 w-full cursor-pointer"
                />
              </a>
              <a href="google-play-link" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/tour-page/GooglePlay.png"
                  alt="Google Play"
                  className="h-10 w-full cursor-pointer"
                />
              </a>
            </div>
            <div className="flex items-center justify-center">
              <img src="/images/tour-page/divider.png" />
            </div>
            <div className="flex-start flex flex-col gap-6">
              <div className="flex gap-6">
                <a
                  href="insta-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-none outline-none"
                >
                  <img src="/images/tour-page/insta-icon.png" />
                </a>
                <a
                  href="linkedin-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-none outline-none"
                >
                  <img src="/images/tour-page/linkedin-icon.png" />
                </a>
                <a
                  href="x-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-none outline-none"
                >
                  <img src="/images/tour-page/x-icon.png" />
                </a>
              </div>
              <p className="text-color-text-darkmode-primary">info@email.com</p>
              <p className="text-color-text-darkmode-primary">
                © {new Date().getFullYear()} Bounce. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
