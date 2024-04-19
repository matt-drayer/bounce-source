import * as React from "react";
import styled from "styled-components";
import Link from "components/Link";
import { SIGNUP_CODE_PAGE } from "constants/pages";

export default function BounceAppSection() {
  return (
    <div>
      <div className="min-h-screen bg-brand-gray-1000">
        <div className="flex flex-col md:flex-row justify-between p-5 md:p-20">
          <div>
            <img
              src="/images/tour-page/logo-2.png"
              alt="bounce logo"
              width="auto"
              height="auto"
              className="mb-8 md:mb-0"
            />
          </div>
          <div className="hidden flex flex-col gap-6">
            <h2 className="hidden md:block text-5xl text-color-text-darkmode-primary">
              The Tour runs on the
            </h2>
            <h2 className="hidden md:block text-5xl text-color-text-darkmode-primary font-bold">
              best app in pickleball.
            </h2>
            <div>
              <h3 className="md:hidden text-5xl text-color-text-darkmode-primary mb-0 italic">
                Follow the tour
              </h3>
              <h3 className="md:hidden text-5xl text-color-text-darkmode-primary font-bold mb-0">
                using the best app in pickleball
              </h3>
            </div>
            <div className="hidden flex gap-8 md:flex gap-5">
              <a
                href="app-store-link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-2/3 md:w-1/4 outline-none border-none"
              >
                <img
                  src="/images/tour-page/appStore.png"
                  alt="App Store"
                  className="cursor-pointer w-full h-auto"
                />
              </a>
              <a
                href="google-play-link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-2/3 md:w-1/4 outline-none border-none"
              >
                <img
                  src="/images/tour-page/GooglePlay.png"
                  alt="Google Play"
                  className="cursor-pointer w-full h-auto"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex-col flex xmd:flex-row justify-evenly gap-2 p-8">
          <img src="/images/tour-page/Card2.png" className="mb-8 md:mb-0" />
          <img src="/images/tour-page/Card.png" />
        </div>
        <div className="p-0 px-8 py-8">
          <img
            src="/images/tour-page/Card3.png"
            className="hidden md:block"
          />
          <img
            src="/images/tour-page/Card-mobile.png"
            className="md:hidden"
          />
        </div>
      </div>
    </div>
  );
}
