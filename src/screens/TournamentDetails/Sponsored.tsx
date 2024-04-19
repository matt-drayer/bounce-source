import React from 'react';

export default function Sponsored() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Sponsored by
        </h2>
        <div className="grid grid-cols-3 items-center gap-12">
          <img src="images/tournamentDetails/Sponsored-2.png" />
          <img src="images/tournamentDetails/Sponsored-3.png" />
          <img src="images/tournamentDetails/Sponsored-1.png" />
          <img src="images/tournamentDetails/Sponsored-4.png" />
          <img src="images/tournamentDetails/Sponsored-5.png" />
        </div>
      </div>
    </>
  );
}
