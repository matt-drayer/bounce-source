import * as React from 'react';
import {
  ROOT_PAGE,
  getCityCourtsPageUrl,
  getCountryCourtsPageUrl,
  getCountrySubdivisionCourtsPageUrl,
} from 'constants/pages';
import Home from 'svg/Home';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Breadcrumbs from 'components/Breadcrumbs';
import Footer from 'components/Footer';
import CardVenue from 'components/cards/CardVenue';
import Head from 'components/utilities/Head';
import { Props } from './types';

export const generateBreadcrumbs = ({
  isForJsonLd,
  cityName,
  citySlug,
  regionName,
  regionSlug,
  countryId,
  countryName,
  countrySlug,
}: {
  isForJsonLd?: boolean;
  cityName: string;
  citySlug: string;
  regionName: string;
  regionSlug: string;
  countryId: string;
  countryName: string;
  countrySlug: string;
}) => {
  return {
    ui: isForJsonLd
      ? []
      : [
          {
            label: <Home className="w-4" />,
            url: ROOT_PAGE,
          },
          {
            label: countryId || '',
            url: getCountryCourtsPageUrl(countrySlug || ''),
          },
          {
            label: regionName || '',
            url: getCountrySubdivisionCourtsPageUrl(regionSlug || ''),
          },
          {
            label: cityName,
            url: '',
            isActivePage: true,
          },
        ],
    jsonLd: [
      {
        name: 'Home',
        id: ROOT_PAGE,
      },
      {
        name: `${countryName} Pickleball Courts` || '',
        id: getCountryCourtsPageUrl(countrySlug || ''),
      },
      {
        name: `${regionName} Pickleball Courts` || '',
        id: getCountrySubdivisionCourtsPageUrl(regionSlug || ''),
      },
      {
        name: `${cityName} Pickleball Courts`,
        id: getCityCourtsPageUrl(citySlug || ''),
      },
    ].map((item) => ({
      ...item,
      id: `${process.env.APP_URL}${item.id}`,
    })),
  };
};

export default function CityVenuesPage({ city, jsonLd }: Props) {
  if (!city) {
    return null;
  }

  return (
    <>
      <Head
        title={`Pickleball courts in ${city?.name} (${city?.venues?.length} locations)`}
        description={`Find pickleball courts near you in ${city?.name}, ${city?.countrySubdivision?.name}. Play pickleball at ${city?.venues?.length} courts.`}
      />
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <main className="flex grow flex-col bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
          <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
            <div className="mx-auto flex max-w-6xl flex-col-reverse justify-between px-4 py-ds-lg md:flex-row md:items-center">
              <h1 className="typography-product-heading">
                Pickleball Courts in {city?.name}{' '}
                <span className="hidden lg:inline">({city?.venues?.length} locations)</span>
              </h1>
              <div className="mb-2 md:mb-0">
                <Breadcrumbs
                  breadcrumbs={
                    generateBreadcrumbs({
                      cityName: city?.name || '',
                      citySlug: city?.slug || '',
                      regionName: city?.countrySubdivision?.name || '',
                      regionSlug: city?.countrySubdivision?.slug || '',
                      countryId: city?.countrySubdivision?.country?.id || '',
                      countryName: city?.countrySubdivision?.country?.name || '',
                      countrySlug: city?.countrySubdivision?.country?.slug || '',
                    }).ui
                  }
                />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {city?.venues.map((venue) => {
                if (!venue || !venue.id || !venue.title) {
                  return null;
                }

                return (
                  <CardVenue
                    key={venue.id}
                    {...venue}
                    totalCourtCount={venue.indoorCourtCount + venue.outdoorCourtCount}
                    imageUrl={venue.images[0]?.url}
                  />
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </SafeAreaPage>
      {!!jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
    </>
  );
}
