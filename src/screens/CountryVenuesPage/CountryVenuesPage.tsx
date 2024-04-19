import * as React from 'react';
import { getCountrySubdivisionCourtsPageUrl } from 'constants/pages';
import City from 'svg/City';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Footer from 'components/Footer';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import { Props } from './types';

const Regions = ({ subdivisions }: Pick<Props, 'subdivisions' | 'hasSubdivisionImages'>) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-ds-3xl">
      <div className="grid grid-cols-1 gap-ds-xl sm:grid-cols-2 lg:grid-cols-4">
        {(subdivisions || []).map((region) => (
          <Link
            key={region.slug}
            href={getCountrySubdivisionCourtsPageUrl(region.slug)}
            className="flex flex-col items-center rounded-lg p-ds-xl text-center"
          >
            <div>
              <City className="w-12" />
            </div>
            <div className="typography-product-heading-compact mt-ds-xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {region.name}
            </div>
            <div className="typography-product-body mt-ds-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              {region.courtCount} courts
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function CountryVenuesPage({
  countryName,
  subdivisions,
  hasSubdivisionImages,
  jsonLd,
}: Props) {
  return (
    <>
      <Head title={`Pickleball Courts in ${countryName}`} />
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <main className="bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
          <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
            <div className="mx-auto max-w-6xl px-4">
              <h1 className="typography-product-heading py-ds-lg">{`Pickleball Courts in ${countryName}`}</h1>
            </div>
          </div>
          <Regions subdivisions={subdivisions} hasSubdivisionImages={hasSubdivisionImages} />
        </main>
        <Footer />
      </SafeAreaPage>
      {!!jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
    </>
  );
}
