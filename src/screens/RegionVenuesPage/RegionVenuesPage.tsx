import * as React from 'react';
import { getCityCourtsPageUrl, getCourtPageUrl } from 'constants/pages';
import {
  ROOT_PAGE,
  getCountryCourtsPageUrl,
  getCountrySubdivisionCourtsPageUrl,
} from 'constants/pages';
import City from 'svg/City';
import Home from 'svg/Home';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Breadcrumbs from 'components/Breadcrumbs';
import Footer from 'components/Footer';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import { Props } from './types';

const VISIBLE_CITIES = 16;
const VISIBLE_VENUES = 16;

type Venues = Pick<Props, 'venues'>;

export const generateBreadcrumbs = ({
  isForJsonLd,
  regionName,
  regionSlug,
  countryId,
  countryName,
  countrySlug,
}: {
  isForJsonLd?: boolean;
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
    ].map((item) => ({
      ...item,
      id: `${process.env.APP_URL}${item.id}`,
    })),
  };
};

const CityLinkList = ({ cities }: Pick<Props, 'cities'>) => {
  const [isShowAll, setIsShowAll] = React.useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 gap-ds-2xl sm:grid-cols-2 lg:grid-cols-4">
        {cities.slice(0, VISIBLE_CITIES).map((city, index) => (
          <Link
            key={index}
            href={getCityCourtsPageUrl(city.slug)}
            className="flex flex-col items-center justify-center rounded-lg p-ds-xl"
          >
            <div className="">
              <City className="w-12" />
            </div>
            <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {city.name}
            </h2>
            <span className="typography-product-body mt-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">{`${
              city.courtCount || 0
            } courts`}</span>
          </Link>
        ))}
      </div>
      <div
        className={classNames(
          'grid-cols-1 gap-ds-2xl sm:grid-cols-2 lg:grid-cols-4',
          isShowAll ? 'grid' : 'hidden',
        )}
      >
        {cities.slice(VISIBLE_CITIES).map((city, index) => (
          <Link
            key={index}
            href={getCityCourtsPageUrl(city.slug)}
            className="flex flex-col items-center justify-center rounded-lg p-ds-xl"
          >
            <div className="">
              <City className="w-12" />
            </div>
            <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {city.name}
            </h2>
            <span className="typography-product-body mt-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">{`${
              city.courtCount || 0
            } courts`}</span>
          </Link>
        ))}
      </div>
      {cities.length > VISIBLE_CITIES && (
        <div className="mt-ds-2xl flex items-center justify-center">
          <button
            onClick={() => setIsShowAll(true)}
            className="button-rounded-inline-primary-inverted px-6"
          >
            Show all cities
          </button>
        </div>
      )}
    </div>
  );
};

const Spacer = () => (
  <span className="block h-[6px] w-[6px] rounded-full bg-color-brand-primary">&nbsp;</span>
);

const CourtItem = ({
  title,
  cityName,
  slug,
  indoorCourtCount,
  outdoorCourtCount,
}: Venues['venues'][0]) => {
  return (
    <Link href={getCourtPageUrl(slug)}>
      <h3 className="flex items-center space-x-ds-md">
        <span className="typography-product-subheading text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {title}
        </span>
        <Spacer />
        <span className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {cityName}
        </span>
        <Spacer />
        <span className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {indoorCourtCount || 0 + outdoorCourtCount || 0} courts
        </span>
      </h3>
    </Link>
  );
};

const CourtList = ({ venues, regionName }: Venues & { regionName: string }) => {
  const [isShowAll, setIsShowAll] = React.useState(false);

  return (
    <div>
      <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        Every pickleball court in {regionName}
      </h2>
      <div className="mt-ds-2xl grid grid-cols-1 gap-4 gap-x-2 lg:grid-cols-2">
        {venues.slice(0, VISIBLE_VENUES).map((item, index) => (
          <CourtItem key={index} {...item} />
        ))}
      </div>
      <div
        className={classNames(
          'grid-cols-1 gap-4 gap-x-2 lg:grid-cols-2',
          isShowAll ? 'grid' : 'hidden',
        )}
      >
        {venues.slice(VISIBLE_VENUES).map((item, index) => (
          <CourtItem key={index} {...item} />
        ))}
      </div>
      <div className="mt-ds-2xl flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsShowAll(true)}
          className="button-rounded-inline-primary-inverted px-6"
        >
          Show all courts
        </button>
      </div>
    </div>
  );
};

export default function RegionVenuesPage({
  countryId,
  countryName,
  countrySlug,
  regionName,
  regionSlug,
  cities,
  venues,
  jsonLd,
}: Props) {
  return (
    <>
      <Head title={`Pickleball Courts in ${regionName}`} />
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <main className="bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
          <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
            <div className="mx-auto flex max-w-6xl flex-col-reverse justify-between px-4 py-ds-lg md:flex-row md:items-center">
              <h1 className="typography-product-heading">{`Pickleball Courts in ${regionName}`}</h1>
              <div className="mb-2 md:mb-0">
                <Breadcrumbs
                  breadcrumbs={
                    generateBreadcrumbs({
                      regionName,
                      regionSlug,
                      countryId,
                      countryName,
                      countrySlug,
                    }).ui
                  }
                />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <CityLinkList cities={cities || []} />
          </div>
          <div className="px-4 pb-20">
            <div className="mx-auto mt-10 max-w-6xl border-t border-color-border-input-lightmode pt-10 dark:border-color-border-input-darkmode">
              <CourtList regionName={regionName} venues={venues || []} />
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
