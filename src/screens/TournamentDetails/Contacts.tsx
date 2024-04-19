import React from 'react';
import Internet from 'svg/Globe';
import Message from 'svg/Mail';
import Phone from 'svg/Phone';

export default function Contacts() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Contacts
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <Message className="h-5 w-5 text-color-text-lightmode-icon" />
            <p className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              samplemail@.com
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-5 w-5 text-color-text-lightmode-icon" />
            <p className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              555 666 777 888
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Internet className="h-5 w-5 text-color-text-lightmode-icon" />
            <p className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              www.samplewebsite.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
