import * as React from "react";
import styled from "styled-components";
import Link from "components/Link";
import { SIGNUP_CODE_PAGE } from "constants/pages";

export default function DinkSection() {
  return (
    <div className="bg-brand-gray-1000">
      <div className="flex relative mt-8">
        <img
          src="/images/tour-page/ball-size.png"
          className="w-1/2 absolute top-[-120px] right-0 md:w-1/4"
        />
      </div>
      <div className="flex flex-col gap-5 mt-12 px-8 md:flex-row gap-5">
        <div className="md:w-1/2 md:w-1/2 space-y-6">
          <img src="/images/tour-page/The-Dink-logo.png" />
          <h2 className="text-5xl text-color-text-darkmode-primary font-semibold">
            Played by amateurs. Covered like the pros.
          </h2>
          <h2 className="text-color-text-darkmode-primary w-3/4">
            The Bounce Tour is covered by The Dink. Players will be featured in
            interviews, blog series, the newsletter and more.
          </h2>
          <div className="hidden md:flex justify-start mt-6">
            <Link
              href={SIGNUP_CODE_PAGE}
              className="button-rounded-inline-background-bold ml-4 flex items-center justify-center px-6 py-3 font-normal text-sm text-gray-800 bg-white border-none sm:ml-6"
            >
              Learn more (?)
            </Link>
          </div>
        </div>
        <img src="/images/tour-page/dink-image2.png" />
      </div>
    </div>
  );
}
