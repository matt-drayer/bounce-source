import * as React from 'react';
import styled from 'styled-components';

const Newsletter = () => {
  return (
    <div className="relative mx-auto mb-16 w-full max-w-[1300px] pl-6 pr-6 pt-16 sm:mb-24 md:pl-16 md:pr-16">
      <div className="relative flex items-center">
        <Gradient className="absolute bottom-0 z-10 h-full w-full rounded-3xl" />

        <img
          src="/images/tournaments/lesli-whitecotton-UHZ_w1bOIvY-unsplash.jpg"
          alt="newsletter"
          className="h-full max-h-[630px] w-full rounded-3xl"
        />
        <div className="absolute z-20 mx-auto flex w-full flex-col items-center pl-2 pr-2 sm:pl-0 sm:pr-0">
          <span className="text-[1.8rem] font-bold italic leading-tight text-brand-gray-1000 sm:text-[4rem]">
            Don't miss out.
          </span>
          <span className="text-center text-[1.8rem] font-normal leading-tight text-white sm:text-[4rem]">
            Subscribe to our newsletter
          </span>

          <div className="relative mt-6 flex w-full max-w-[392px] flex-row flex-nowrap items-center rounded-3xl bg-brand-fire-900 sm:mt-16">
            <input
              className="input-form h-[56px] rounded-3xl bg-brand-gray-50/[0.15] text-brand-gray-200 focus:outline-0"
              placeholder="Your email"
            />
            <button className="button-rounded-inline-background-bold absolute right-[9px] mx-auto mt-0 flex h-[39px] w-[100px] items-center justify-center rounded-[28px] py-4 pb-2 pl-3 pr-3 pt-2">
              <i>Sign Up</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Gradient = styled.div`
  background: linear-gradient(180deg, rgba(248, 61, 37, 0.78) 0%, rgba(248, 61, 37, 0) 100%);
`;

export default Newsletter;
