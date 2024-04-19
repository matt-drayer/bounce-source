import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { SIGNUP_CODE_PAGE } from 'constants/pages';
import Link from 'components/Link';

export default function TournamentFormatSection() {
  return (
    <div className="p-5 md:p-20">
      <div className="mb-8 mt-8 flex flex-col justify-between md:mb-16 md:flex-row">
        <h2 className="flex justify-start text-brand-gray-500">FORMAT</h2>
        <div className="mt-4 flex-row flex-col gap-3 gap-6 md:flex">
          <div>
            <h2 className="mr-4 inline-block text-3xl italic text-brand-gray-1000 md:text-5xl">
              Tour
            </h2>
            <h3 className="inline-block text-2xl font-bold text-brand-gray-1000 md:text-5xl">
              Format
            </h3>
          </div>
          <h3 className="text-text-brand-gray-500 hidden font-bold md:block">
            All tournaments have the same structure
          </h3>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col justify-center gap-5 md:flex-row">
        {/* first column*/}
        <div className="w-full flex-col gap-5 md:flex md:w-1/2">
          <div className="rounded-md bg-brand-gray-50 p-6">
            <h2 className="text-text-brand-gray-500 mb-8 text-sm">SCORING</h2>
            <h2 className="mb-4 hidden text-2xl font-bold text-black md:block">Pool play</h2>
            <h3 className="mb-4 text-2xl font-bold text-black md:hidden">Round robin</h3>
            <div className="border-gray-1200 flex justify-between rounded-md border bg-white p-3">
              <h3 className="text-bg-brand-gray-600 text-sm font-semibold">
                traditional scoring to
              </h3>
              <h3 className="text-sm font-bold text-brand-gray-900">11</h3>
            </div>
            <h4 className="mb-4 mt-8 text-2xl font-bold text-black">Single elimination</h4>
            <div className="border-gray-1200 flex justify-between rounded-md border bg-white p-3">
              <h4 className="text-bg-brand-gray-600 text-sm font-semibold">
                traditional scoring to
              </h4>
              <h4 className="text-sm font-bold text-brand-gray-900">11</h4>
            </div>
            <div className="border-gray-1200 flex justify-between rounded-md border-t bg-white p-3">
              <h5 className="text-bg-brand-gray-600 text-sm font-semibold">best of</h5>
              <h5 className="text-sm font-bold text-brand-gray-900">3</h5>
            </div>
          </div>
          <div className="hidden rounded-md bg-brand-gray-50 p-6 md:block">
            <h6 className="text-text-brand-gray-500 mb-6 text-sm">THE TOUR FINAL</h6>
            <h6 className="mb-4 w-3/4 text-2xl font-bold font-bold text-black">
              The Tour Finalis invite-only
            </h6>
            <h6 className="mb-6 text-sm font-semibold text-brand-gray-1000">
              Teams that make it to the semi-finals at each tournament will receive an invite to the
              Tour Finals in December
            </h6>
          </div>
        </div>

        {/* second column*/}
        <div className="flex w-full flex-col flex-col items-center gap-5 gap-5 md:flex md:w-1/2">
          <div className="mb-2">
            <div className="rounded-md bg-brand-gray-900 p-6">
              <p className="mb-3 text-sm text-brand-gray-300">FORMAT</p>
              <p className="text-2xl font-bold text-white">
                Pool play followed by single elimination
              </p>
            </div>
          </div>
          <div className="mb-2">
            <img src="/images/tour-page/Card-m.png" />
          </div>
          <div className="mb-2 hidden md:block">
            <img src="/images/tour-page/phone-prize.png" />
          </div>
        </div>

        {/* third column */}
        {/*only for big screen*/}
        <div className="hidden w-1/2 flex-col gap-5 md:flex">
          <div className="rounded-md bg-brand-gray-50 p-8">
            <p className="mb-3 text-sm text-brand-gray-500">EVENTS & SKILL LEVELS</p>
            <p className="mb-4 text-2xl font-bold text-black">Ratings not required</p>
            <p className="mb-6 text-sm font-semibold text-brand-gray-1000">
              Pickleball ratings, like DUPR or UTR-P, are not required for the Tour, nor will
              matches count towards your rating.
            </p>
            <div className="border-gray-1200 mb-2 flex justify-between rounded-md border bg-white p-3">
              <div className=" mb-2 flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Men’s</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">24 teams per event</p>
              </div>
              <div className="flex gap-5">
                <span className="inline-block rounded-full bg-brand-green-100 px-2 py-1 text-xs font-semibold text-brand-green-600">
                  Open
                </span>
                <span className="inline-block rounded-full bg-brand-sea-blue-100 px-2 py-1 text-xs font-semibold text-brand-sea-blue-600">
                  Intermediate
                </span>
              </div>
            </div>
            <div className="border-gray-1200 mb-2 flex justify-between rounded-md border bg-white p-3">
              <div className=" mb-2 flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Women’s</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">24 teams per event</p>
              </div>
              <div className="flex gap-5">
                <span className="inline-block rounded-full bg-brand-green-100 px-2 py-1 text-xs font-semibold text-brand-green-600">
                  Open
                </span>
                <span className="inline-block rounded-full bg-brand-sea-blue-100 px-2 py-1 text-xs font-semibold text-brand-sea-blue-600">
                  Intermediate
                </span>
              </div>
            </div>
            <div className="border-gray-1200 mb-2 flex justify-between rounded-md border bg-white p-3">
              <div className=" mb-2 flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Mixed</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">24 teams per event</p>
              </div>
              <div className="flex gap-5">
                <span className="inline-block rounded-full bg-brand-green-100 px-2 py-1 text-xs font-semibold text-brand-green-600">
                  Open
                </span>
                <span className="inline-block rounded-full bg-brand-sea-blue-100 px-2 py-1 text-xs font-semibold text-brand-sea-blue-600">
                  Intermediate
                </span>
              </div>
            </div>
          </div>
          <img src="/images/tour-page/Card-Prize.png" className="h-auto" />
        </div>
        {/*only for small screen */}
        <div className=" flex w-full flex-col gap-2 md:hidden md:w-1/2">
          <div className="rounded-md bg-brand-gray-50 p-8">
            <p className="text-text-brand-gray-500 mb-3 text-sm">EVENTS & SKILL LEVELS</p>
            <p className="mb-4 text-2xl font-bold text-black">DUPR required for all</p>
            <div className="border-gray-1200 mb-2 flex justify-between rounded-md border bg-white p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Men's 3.0-4.0</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">32 teams</p>
              </div>
            </div>
            <div className="border-gray-1200 mb-4 rounded-md border bg-white p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Men's 4.0-5.0</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">32 teams</p>
              </div>
            </div>
            <div className="border-gray-1200 mb-4 rounded-md border bg-white p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Women’s 3.0 - 4.0</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">32 teams</p>
              </div>
            </div>
            <div className="border-gray-1200 mb-4 rounded-md border bg-white p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Mixed 3.0 - 4.0</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">16 teams</p>
              </div>
            </div>
            <div className="border-gray-1200 mb-4 rounded-md border bg-white p-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-brand-gray-1000">Mixed 4.0 - 5.0</p>
                <p className="text-text-brand-gray-500 text-sm font-bold">16 teams</p>
              </div>
            </div>
          </div>
          <img src="/images/tour-page/Card-Prize.png" className="mt-6" />
          <div className="mt-8 rounded-md bg-brand-gray-50 p-6">
            <p className="text-text-brand-gray-500 mb-8 text-sm">THE TOUR FINAL</p>
            <p className="mb-4 w-3/4 text-2xl font-bold font-bold text-black">
              The Tour Finalis invite-only
            </p>
            <p className="mb-6 text-sm font-semibold text-brand-gray-1000">
              Teams that make it to the semi-finals at each tournament will receive an invite to the
              Tour Finals in December
            </p>
          </div>
          <img src="/images/tour-page/phone-prize.png" />
        </div>
      </div>
      <div className="mb-12 mt-12 items-center justify-center md:flex">
        <Link
          href={SIGNUP_CODE_PAGE}
          className="button-rounded-inline-background-bold min-w-auto ml-4 flex h-auto w-full items-center justify-center border-none bg-brand-gray-900 px-4 py-3 text-sm font-normal md:w-auto"
        >
          Register now
        </Link>
      </div>
    </div>
  );
}
