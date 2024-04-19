import * as Sentry from '@sentry/nextjs';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import { getCourtPageUrl } from 'constants/pages';
import { getAllCityVenuePaths } from 'services/server/graphql/queries/getAllCityVenuePaths';
import { getCityVenuesByCitySlug } from 'services/server/graphql/queries/getCityVenuesByCitySlug';
import { generateBreadcrumbListJsonLd } from 'utils/shared/json-ld/breadcrumbs';
import { combineJsonLdSchemas } from 'utils/shared/json-ld/combineJsonLdSchemas';
import { generateFaqJsonLd } from 'utils/shared/json-ld/faq';
import { generatePlaceJsonLd } from 'utils/shared/json-ld/place';
import { generateSportsActivityLocationJsonLd } from 'utils/shared/json-ld/sports';
import CityVenuesPage, { Props, generateBreadcrumbs } from 'screens/CityVenuesPage';

const REVALIDATE_IN_SECONDS = 30 * 60 * 1;

export const getStaticProps: GetStaticProps<Props, { citySlug: string }> = async ({ params }) => {
  const citySlug = params?.citySlug;

  if (!citySlug) {
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }

  try {
    const cityVenueResponse = await getCityVenuesByCitySlug({ slug: citySlug });
    const city = cityVenueResponse?.cities[0];

    if (!city || !city?.id || !city?.name) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const cityPlaceJsonLd = generatePlaceJsonLd({
      name: city.name,
      geo: {
        latitude: city.latitude,
        longitude: city.longitude,
      },
      containsPlace: city?.venues?.map((venue) =>
        generateSportsActivityLocationJsonLd({
          name: venue.title,
          address: venue.addressString,
          image: venue?.images?.[0]?.url || '',
          url: `${process.env.APP_URL}${getCourtPageUrl(venue.slug)}`,
        }),
      ),
    });
    const breadcrumbs = generateBreadcrumbListJsonLd({
      items: generateBreadcrumbs({
        cityName: city?.name || '',
        citySlug: city?.slug || '',
        regionName: city?.countrySubdivision?.name || '',
        regionSlug: city?.countrySubdivision?.slug || '',
        countryId: city?.countrySubdivision?.country?.id || '',
        countryName: city?.countrySubdivision?.country?.name || '',
        countrySlug: city?.countrySubdivision?.country?.slug || '',
      }).jsonLd,
    });

    const combinedSchemas = combineJsonLdSchemas([breadcrumbs, cityPlaceJsonLd]);

    return {
      props: { city, jsonLd: JSON.stringify(combinedSchemas) },
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
  const cities = await getAllCityVenuePaths();

  const paths = cities.cities
    .filter((c) => !!c && c.venues.length > 0)
    .map((city) => {
      return {
        params: {
          citySlug: city.slug,
        },
      };
    });

  return {
    paths,
    fallback: true,
  };
};

export default CityVenuesPage;
