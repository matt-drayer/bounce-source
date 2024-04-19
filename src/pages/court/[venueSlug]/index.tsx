import * as Sentry from '@sentry/nextjs';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import {
  AmenitiesEnum,
  CourtSurfacesEnum,
  VenueAccessTypesEnum,
  VenueNetsEnum,
} from 'types/generated/server';
import { getAllVenuePaths } from 'services/server/graphql/queries/getAllVenuePaths';
import { getVenueBySlug } from 'services/server/graphql/queries/getVenueBySlug';
import { generateBreadcrumbListJsonLd } from 'utils/shared/json-ld/breadcrumbs';
import { combineJsonLdSchemas } from 'utils/shared/json-ld/combineJsonLdSchemas';
import { generateFaqJsonLd } from 'utils/shared/json-ld/faq';
import { generateLocalBusinessJsonLd } from 'utils/shared/json-ld/localBusiness';
import { generateSportsActivityLocationJsonLd } from 'utils/shared/json-ld/sports';
import CourtPage, { Props, generateBreadcrumbs } from 'screens/CourtPage';

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

interface FaqProps {
  venue: Awaited<ReturnType<typeof getVenueBySlug>>['venues'][0];
}

const mapSurfaceToName = {
  [CourtSurfacesEnum.Acrylic]: 'acrylic',
  [CourtSurfacesEnum.Asphalt]: 'asphalt',
  [CourtSurfacesEnum.Clay]: 'clay',
  [CourtSurfacesEnum.Carpet]: 'carpet',
  [CourtSurfacesEnum.Concrete]: 'concrete',
  [CourtSurfacesEnum.Grass]: 'grass',
  [CourtSurfacesEnum.Hard]: 'hard',
  [CourtSurfacesEnum.Wood]: 'wood',
};

const mapAmenitiesToName = {
  [AmenitiesEnum.Food]: 'food',
  [AmenitiesEnum.Lights]: 'lights',
  [AmenitiesEnum.LockerRooms]: 'locker rooms',
  [AmenitiesEnum.ProShop]: 'pro shop',
  [AmenitiesEnum.Restrooms]: 'restrooms',
  [AmenitiesEnum.Training]: 'training',
  [AmenitiesEnum.Water]: 'water',
  [AmenitiesEnum.WheelchairAccessible]: 'wheelchair accessible',
};

const generateFaqs = ({ venue }: FaqProps) => {
  const faqs: { question: string; answer: string }[] = [];

  if (!!venue.accessType) {
    if (venue.accessType === VenueAccessTypesEnum.Free) {
      faqs.push({
        question: `Is it free to play at ${venue.title}?`,
        answer: `You can play for free at ${venue.title}.`,
      });
    } else {
      if (venue.accessType === VenueAccessTypesEnum.Membership) {
        faqs.push({
          question: `Does it cost money to play at ${venue.title}?`,
          answer: `Playing at ${venue.title} requires a membership.`,
        });
      } else if (venue.accessType === VenueAccessTypesEnum.OneTime) {
        faqs.push({
          question: `Does it cost money to play at ${venue.title}?`,
          answer: `Playing at ${venue.title} requires a one-time fee to access the courts.`,
        });
      } else if (venue.accessType === VenueAccessTypesEnum.Private) {
        faqs.push({
          question: `Does it cost money to play at ${venue.title}?`,
          answer: `${venue.title} is a private club.`,
        });
      }
    }
  }

  if (venue.indoorCourtCount || venue.outdoorCourtCount) {
    faqs.push({
      question: `How many courts are at ${venue.title}?`,
      answer: `${venue.title} has ${venue.indoorCourtCount || 0} indoor courts and ${
        venue.outdoorCourtCount || 0
      } outdoor courts. There are a total of ${
        venue.indoorCourtCount + venue.outdoorCourtCount
      } courts.`,
    });
  }

  if (venue.pickleballNets) {
    if (venue.pickleballNets === VenueNetsEnum.Permanent) {
      faqs.push({
        question: `Are there dedicated pickleball courts?`,
        answer: `${venue.title} has dedicated and permanent pickleball courts.`,
      });
    } else if (venue.pickleballNets === VenueNetsEnum.Tennis) {
      faqs.push({
        question: `Are there dedicated pickleball courts?`,
        answer: `${venue.title} uses tennis courts.`,
      });
    } else if (venue.pickleballNets === VenueNetsEnum.Portable) {
      faqs.push({
        question: `Are there dedicated pickleball courts?`,
        answer: `${venue.title} uses portable nets.`,
      });
    } else if (venue.pickleballNets === VenueNetsEnum.BringYourOwn) {
      faqs.push({
        question: `Are there dedicated pickleball courts?`,
        answer: `You must bring your own nets to ${venue.title}.`,
      });
    }
  }

  if (venue.courtSurfaces) {
    const surfaces: string[] = [];

    venue.courtSurfaces.forEach((surface) => {
      surfaces.push(mapSurfaceToName[surface.courtSurface]);
    });

    faqs.push({
      question: `What are the court surfaces at ${venue.title}?`,
      answer: `Surfaces: ${surfaces.join(', ')}.`,
    });
  }

  if (venue.addressString) {
    faqs.push({
      question: `Where is ${venue.title} located?`,
      answer: `${venue.title} is located at ${venue.addressString}.`,
    });
  }

  if (venue.email || venue.phoneNumber || venue.websiteUrl) {
    const contactInfo: string[] = [];

    if (venue.email) {
      contactInfo.push(`Email: ${venue.email}`);
    }

    if (venue.phoneNumber) {
      contactInfo.push(`Phone: ${venue.phoneNumber}`);
    }

    if (venue.websiteUrl) {
      contactInfo.push(`Website: ${venue.websiteUrl}`);
    }

    faqs.push({
      question: `How can I contact ${venue.title}?`,
      answer: contactInfo.join(', '),
    });
  }

  if (venue.amenities && venue.amenities.length > 0) {
    const amenities: string[] = [];

    venue.amenities.forEach((amenity) => {
      amenities.push(mapAmenitiesToName[amenity.amenity]);
    });

    faqs.push({
      question: `What amenities does ${venue.title} have?`,
      answer: `Amenities: ${amenities.join(', ')}.`,
    });
  }

  // if (venue.description) {
  //   faqs.push({
  //     question: `What is ${venue.title}?`,
  //     answer: venue.description,
  //   });
  // }

  faqs.push({
    question: `How do I play at ${venue.title}?`,
    answer: `You can play at ${venue.title} by joining or creating an open play through Bounce.`,
  });

  return faqs;
};

export const getStaticProps: GetStaticProps<Props, { venueSlug: string }> = async ({ params }) => {
  const venueSlug = params?.venueSlug;

  if (!venueSlug) {
    return {
      notFound: true,
      revalidate: REVALIDATE_IN_SECONDS,
    };
  }

  try {
    const venueResponse = await getVenueBySlug({ slug: venueSlug });
    const venue = venueResponse?.venues[0];

    if (!venue || !venue?.id || !venue?.title) {
      return {
        notFound: true,
        revalidate: REVALIDATE_IN_SECONDS,
      };
    }

    const faqs = generateFaqs({ venue });

    const sportsFacilitySchema = generateSportsActivityLocationJsonLd({
      name: venue.title,
      address: venue.addressString,
      // description: venue.description,
      telephone: venue.phoneNumber,
      url: venue.websiteUrl,
      image: venue?.images?.[0]?.url || '',
      geo: {
        latitude: venue.latitude,
        longitude: venue.longitude,
      },
    });
    const localBusinessSchema = generateLocalBusinessJsonLd({
      name: venue.title,
      address: venue.addressString,
      // description: venue.description,
      telephone: venue.phoneNumber,
      url: venue.websiteUrl,
      image: venue?.images?.[0]?.url || '',
      geo: {
        latitude: venue.latitude,
        longitude: venue.longitude,
      },
    });
    const faqSchema = generateFaqJsonLd({
      items: faqs,
    });
    const breadcrumbs = generateBreadcrumbListJsonLd({
      items: generateBreadcrumbs({
        venueTitle: venue.title,
        venueSlug: venue?.slug || '',
        cityName: venue?.city?.name || '',
        citySlug: venue?.city?.slug || '',
        regionName: venue?.city?.countrySubdivision?.name || '',
        regionSlug: venue?.city?.countrySubdivision?.slug || '',
        countryId: venue?.city?.countrySubdivision?.country?.id || '',
        countryName: venue?.city?.countrySubdivision?.country?.name || '',
        countrySlug: venue?.city?.countrySubdivision?.country?.slug || '',
      }).jsonLd,
    });

    const combinedSchemas = combineJsonLdSchemas([
      sportsFacilitySchema,
      localBusinessSchema,
      faqSchema,
      breadcrumbs,
    ]);

    return {
      props: { venue, faqs: faqs, jsonLd: JSON.stringify(combinedSchemas) },
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
  if (IS_ALL_AS_ISR) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const venues = await getAllVenuePaths();

  const paths = venues.venues.map((venue) => {
    return {
      params: {
        venueSlug: venue.slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export default CourtPage;
