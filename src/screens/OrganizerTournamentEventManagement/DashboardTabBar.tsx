import React, { useState } from 'react';
import Registrants from './Registrants';
import TournamentContent from '../TournamentDetails/TournamentContent';

interface EventDetailsProps {
  cardData: any;
}

export default function DashboardTabBar({ cardData }: EventDetailsProps) {
  const [activeTab, setActiveTab] = useState('Registrants');
  const faqs = cardData?.faqs;
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="p-12">
      <div className="mb-4 border-b border-gray-300 dark:border-gray-700">
        <ul
          className="-mb-px flex flex-wrap gap-6 text-center text-sm font-medium"
          id="default-tab"
          role="tablist"
        >
          <li className="me-2" role="presentation">
            <button
              className={`typography-product-body inline-block rounded-t-lg border-b-2 p-4 text-color-text-lightmode-secondary  dark:text-color-text-darkmode-secondary${
                activeTab === 'Registrants' ? 'border border-black' : ''
              }`}
              onClick={() => handleTabClick('Registrants')}
              type="button"
              role="tab"
              aria-controls="Registrants"
              aria-selected={activeTab === 'Registrants'}
            >
              Registrants
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`typography-product-body inline-block rounded-t-lg border-b-2 p-4 text-color-text-lightmode-secondary  dark:text-color-text-darkmode-secondary${
                activeTab === 'TournamentPreview' ? 'border border-black' : ''
              }`}
              onClick={() => handleTabClick('TournamentPreview')}
              type="button"
              role="tab"
              aria-controls="TournamentPreview"
              aria-selected={activeTab === 'TournamentPreview'}
            >
              Tournament Preview
            </button>
          </li>
        </ul>
      </div>
      {activeTab === 'TournamentPreview' && (
        <div className="p-[100px] pt-6">
          <TournamentContent event={cardData} isPreview={true} faqs={faqs} />
        </div>
      )}
      {activeTab === 'Registrants' && <Registrants />}
    </div>
  );
}
