import * as React from 'react';
import { Button } from 'components/Button';

export default function TourBanner() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-color-bg-lightmode-brand from-color-bg-lightmode-brand to-color-bg-darkmode-invert to-color-bg-lightmode-invert p-2 pl-4 pr-4 dark:bg-gradient-to-r">
        <p className="w-16 text-sm font-bold uppercase text-white">bounce pickleball tour</p>
        <img src="images/tournamentDetails/panddle.png" className="absolute left-[7.8125rem]" />
        <Button variant="brand" size="sm" isInline>
          See the Tour
        </Button>
      </div>
    </div>
  );
}
