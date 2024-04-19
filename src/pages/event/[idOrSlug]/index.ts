import * as Sentry from '@sentry/nextjs';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import { getCourtPageUrl } from 'constants/pages';
import { type EventPageFieldsFragment } from 'types/generated/server';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { getTournamentStaticDataById } from 'services/server/graphql/queries/getTournamentStaticDataById';
import { getTournamentStaticDataBySlug } from 'services/server/graphql/queries/getTournamentStaticDataBySlug';
import { combineJsonLdSchemas } from 'utils/shared/json-ld/combineJsonLdSchemas';
import { generateFaqJsonLd } from 'utils/shared/json-ld/faq';
import { generateSportsEventJsonLd } from 'utils/shared/json-ld/sportsEvent';
import { isUuidFormatValid } from 'utils/shared/string/isUuidFormatValid';
import TournamentDetails, { PageProps } from 'screens/TournamentDetails';

/**
 * @note it's unclear if this is an option in Vercel so testing if it works
 * "Optional but recommended: use the Edge Runtime. This can only be done at the page level, not inside nested components."
 */
/**
 * @todo When comparing staging to production, prod was actually faster without this, but I'm unusure if it's the root cause. More analysis needed.
 */
// export const runtime = 'experimental-edge';

const REVALIDATE_IN_SECONDS = 30 * 60 * 1;
const IS_ALL_AS_ISR = true;

export const getStaticProps: GetStaticProps<PageProps, { idOrSlug: string }> = async ({
  params,
}) => {
  const idOrSlug = params?.idOrSlug;

  console.log({ idOrSlug });

  if (!idOrSlug) {
    console.error('No idOrSlug provided');
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }

  try {
    console.log(1);
    let event: EventPageFieldsFragment | null = null;

    if (isUuidFormatValid(idOrSlug)) {
      const eventByPk = await getTournamentStaticDataById({ id: idOrSlug });

      console.log('eventByPk', eventByPk);

      if (eventByPk?.eventsByPk) {
        console.log(2);
        event = eventByPk.eventsByPk;
      }
    }

    if (!event) {
      console.log(3);
      const eventBySlug = await getTournamentStaticDataBySlug({ slug: idOrSlug });
      event = eventBySlug?.events?.[0] || null;

      console.log('eventBySlug', eventBySlug);
    }

    if (!event) {
      console.log(4);
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const faqs = event.faqs?.length > 0 ? event.faqs : [];
    const addressFromCity =
      event?.city && event.city?.name && event.city?.countrySubdivision?.name
        ? `${event.city.name}, ${event.city.countrySubdivision.name}`
        : '';
    const addressFromVenue = event.venue?.addressString || '';

    const sportsEventSchema = generateSportsEventJsonLd({
      name: event?.title || '',
      sport: 'Pickleball', // @todo: get sport from event
      description: event?.description || '',
      startDate: event?.startDateTime || '',
      endDate: event?.endDateTime || '',
      image: event?.coverImageUrl
        ? getImageUrl({
            url: event.coverImageUrl,
            path: event.coverImagePath || '',
          })
        : undefined,
      location: {
        name: event?.venue?.title || '',
        url: event?.venue?.slug ? `${process.env.APP_URL}${getCourtPageUrl(event.venue.slug)}` : '',
        address:
          event.addressString || addressFromVenue || addressFromCity || event.displayLocation || '',
        geo: {
          latitude: event?.geometry?.coordinates[1] || '',
          longitude: event?.geometry?.coordinates[0] || '',
        },
      },
    });

    const faqSchema =
      faqs.length > 0
        ? generateFaqJsonLd({
            items: faqs,
          })
        : undefined;

    const combinedSchemas = combineJsonLdSchemas([sportsEventSchema, faqSchema].filter((s) => !!s));

    console.log(5);

    return {
      props: { event, faqs: faqs, jsonLd: JSON.stringify(combinedSchemas) },
      revalidate: REVALIDATE_IN_SECONDS,
    };
  } catch (error) {
    console.log('build error', error);
    Sentry.captureException(error);
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (IS_ALL_AS_ISR) {
    return {
      paths: [],
      fallback: true,
    };
  }

  /**
   * @todo generate list of events
   */
  const paths: string[] = [];

  return {
    paths,
    fallback: true,
  };
};

export default TournamentDetails;
