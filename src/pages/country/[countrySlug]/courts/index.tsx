import * as Sentry from '@sentry/nextjs';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import countryPageDataCanada from 'constants/countryPageDataCanada';
import countryPageDataUsa from 'constants/countryPageDataUsa';
import {
  ACTIVE_COUNTRIES,
  ROOT_PAGE,
  getCountryCourtsPageUrl,
  getCountrySubdivisionCourtsPageUrl,
} from 'constants/pages';
import { generateBreadcrumbListJsonLd } from 'utils/shared/json-ld/breadcrumbs';
import { combineJsonLdSchemas } from 'utils/shared/json-ld/combineJsonLdSchemas';
import { generateFaqJsonLd } from 'utils/shared/json-ld/faq';
import { generatePlaceJsonLd } from 'utils/shared/json-ld/place';
import CountryVenuesPage, { Props } from 'screens/CountryVenuesPage';

const REVALIDATE_IN_SECONDS = 30 * 60 * 1;

export const getStaticProps: GetStaticProps<Props, { countrySlug: string }> = async ({
  params,
}) => {
  try {
    const activeCountry = ACTIVE_COUNTRIES.find((country) => country.slug === params?.countrySlug);

    if (!activeCountry) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const countryQuery =
      activeCountry.id === 'USA'
        ? countryPageDataUsa
        : activeCountry.id === 'CAN'
        ? countryPageDataCanada
        : null;

    const countryData = countryQuery?.data?.countriesByPk;

    if (!countryData) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const subdivisionData = countryData.subdivisions || [];
    const activeSubdivisions = subdivisionData.filter((subdivision) => {
      const cities = subdivision.cities || [];
      const citiesWithCourts = cities.filter(
        (city) => (city?.venuesAggregate?.aggregate?.count || 0) > 0,
      );

      return !!citiesWithCourts && citiesWithCourts.length > 0;
    });

    if (!activeSubdivisions || activeSubdivisions.length === 0) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const subdivisions = (activeSubdivisions || []).map((subdivision) => {
      return {
        name: subdivision.name,
        slug: subdivision.slug,
        courtCount: subdivision?.cities?.reduce(
          (acc, city) => acc + (city?.venuesAggregate?.aggregate?.count || 0),
          0,
        ),
      };
    });

    const countrySubdivisionPlaceJsonLd = generatePlaceJsonLd({
      name: countryData.name,
      geo: {
        latitude: countryData.latitude,
        longitude: countryData.longitude,
      },
      containsPlace: subdivisions.map((region) =>
        generatePlaceJsonLd({
          name: region.name,
          url: `${process.env.APP_URL}${getCountrySubdivisionCourtsPageUrl(region.slug)}`,
        }),
      ),
    });
    const breadcrumbs = generateBreadcrumbListJsonLd({
      items: [
        {
          name: 'Home',
          id: `${process.env.APP_URL}${ROOT_PAGE}`,
        },
        {
          name: `${countryData.name} Pickleball Courts`,
          id: `${process.env.APP_URL}${getCountryCourtsPageUrl(countryData.slug)}`,
        },
      ],
    });

    const combinedSchemas = combineJsonLdSchemas([breadcrumbs, countrySubdivisionPlaceJsonLd]);

    return {
      props: {
        countryName: activeCountry?.displayNameOverride || countryData.name,
        hasSubdivisionImages: activeCountry.hasSubdivisionImages || false,
        subdivisions: subdivisions || [],
        jsonLd: JSON.stringify(combinedSchemas),
      },
    };
  } catch (error) {
    console.log('--- ERROR: ', error);
    Sentry.captureException(error);
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ACTIVE_COUNTRIES.map((country) => ({
    params: {
      countrySlug: country.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default CountryVenuesPage;
