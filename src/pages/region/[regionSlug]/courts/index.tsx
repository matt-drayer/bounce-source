import * as Sentry from '@sentry/nextjs';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import { ACTIVE_COUNTRIES, getCityCourtsPageUrl } from 'constants/pages';
import { getCountrySubdivisionPage } from 'services/server/graphql/queries/getCountrySubdivisionPage';
import { getCountrySubdivisionPaths } from 'services/server/graphql/queries/getCountrySubdivisionPaths';
import { generateBreadcrumbListJsonLd } from 'utils/shared/json-ld/breadcrumbs';
import { combineJsonLdSchemas } from 'utils/shared/json-ld/combineJsonLdSchemas';
import { generateFaqJsonLd } from 'utils/shared/json-ld/faq';
import { generatePlaceJsonLd } from 'utils/shared/json-ld/place';
import RegionVenuesPage, { Props, generateBreadcrumbs } from 'screens/RegionVenuesPage';

const REVALIDATE_IN_SECONDS = 30 * 60 * 1;

export const getStaticProps: GetStaticProps<Props, { regionSlug: string }> = async ({ params }) => {
  try {
    const regionSlug = params?.regionSlug;

    if (!regionSlug) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const regionQuery = await getCountrySubdivisionPage({ slug: regionSlug });
    const region = regionQuery?.countrySubdivisions?.[0];

    if (!region) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const cities = (region?.cities || []).filter((city) => city?.venues?.length > 0);
    const citiesWithVenues = cities.map((city) => {
      const cityWithVenue = {
        ...city,
        venues: city.venues.map((venue) => ({
          ...venue,
          cityName: city.name,
        })),
      };

      return cityWithVenue;
    });
    const venues = citiesWithVenues.reduce((acc, city) => {
      return [...acc, ...(city?.venues || [])];
    }, [] as (typeof citiesWithVenues)[0]['venues']);

    const countrySubdivisionPlaceJsonLd = generatePlaceJsonLd({
      name: region.name,
      geo: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      containsPlace: region.cities.map((city) =>
        generatePlaceJsonLd({
          name: city.name,
          url: `${process.env.APP_URL}${getCityCourtsPageUrl(city.slug)}`,
        }),
      ),
    });
    const breadcrumbs = generateBreadcrumbListJsonLd({
      items: generateBreadcrumbs({
        regionName: region.name || '',
        regionSlug: region.slug || '',
        countryId: region.country?.id || '',
        countryName: region.country?.name || '',
        countrySlug: region.country?.slug || '',
      }).jsonLd,
    });

    const combinedSchemas = combineJsonLdSchemas([breadcrumbs, countrySubdivisionPlaceJsonLd]);

    return {
      props: {
        regionName: region.name,
        regionSlug: region.slug,
        countryName: region.country.name,
        countryId: region.country.id,
        countrySlug: region.country.slug,
        cities: cities
          .map((city) => ({
            name: city.name,
            slug: city.slug,
            courtCount: city?.venues?.length || 0,
          }))
          .filter((city) => !!city?.courtCount)
          .sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          }),
        venues,
        jsonLd: JSON.stringify(combinedSchemas),
      },
      revalidate: REVALIDATE_IN_SECONDS,
    };
  } catch (error) {
    Sentry.captureException(error);
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const activeCountrySubdivisions = await Promise.all(
    ACTIVE_COUNTRIES.map((country) => getCountrySubdivisionPaths({ activeCountryId: country.id })),
  );

  const subdivisionsWithVenues = activeCountrySubdivisions?.filter((country) => {
    const hasSubdivision = !!country && country.countrySubdivisions.length > 0;

    if (!hasSubdivision) {
      return false;
    }

    const countrySubdivisions = country.countrySubdivisions || [];
    const activeSubdivisions = countrySubdivisions.filter((subdivision) => {
      const cities = subdivision.cities || [];
      const citiesWithCourts = cities.filter((city) => (city?.venues?.length || 0) > 0);

      return !!citiesWithCourts && citiesWithCourts.length > 0;
    });

    return !!activeSubdivisions && activeSubdivisions.length > 0;
  });

  const paths = subdivisionsWithVenues.map((subdivision) => {
    const countrySubdivisions = subdivision.countrySubdivisions || [];
    const activeSubdivisions = countrySubdivisions.filter((subdivision) => {
      const cities = subdivision.cities || [];
      const citiesWithCourts = cities.filter((city) => (city?.venues?.length || 0) > 0);

      return !!citiesWithCourts && citiesWithCourts.length > 0;
    });

    const pathsForCountry = activeSubdivisions.map((subdivision) => {
      return {
        params: {
          regionSlug: subdivision.slug,
        },
      };
    });

    return pathsForCountry;
  });

  return {
    paths: paths.flat(),
    fallback: true,
  };
};

export default RegionVenuesPage;
