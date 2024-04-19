import * as React from 'react';
import { startOfToday } from 'date-fns';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import {
  PLAY_PAGE,
  ROOT_PAGE,
  getCityCourtsPageUrl,
  getCountryCourtsPageUrl,
  getCountrySubdivisionCourtsPageUrl,
  getCourtPageUrl,
} from 'constants/pages';
import { DEFAULT_VENUE_IMAGE } from 'constants/venues';
import {
  FollowStatusesEnum,
  useGetPlaySessionsByVenueIdAsAnonymousLazyQuery,
  useGetPlaySessionsByVenueIdAsUserLazyQuery,
  useGetUserVenueFollowLazyQuery,
  useUpsertVenueFollowMutation,
} from 'types/generated/client';
import { pageBackOrFallback } from 'utils/client/pageBackOrFallback';
import { getPlatform } from 'utils/mobile/getPlatform';
import { useAuthModals } from 'hooks/useAuthModals';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import ChevronLeft from 'svg/ChevronLeft';
import Home from 'svg/Home';
import Share from 'svg/Share';
import Breadcrumbs from 'components/Breadcrumbs';
import { Button } from 'components/Button';
import Faqs from 'components/Faqs';
import Footer from 'components/Footer';
import Link from 'components/Link';
import CardVenue from 'components/cards/CardVenue';
import ModalPlaySession from 'components/modals/ModalPlaySession';
import ModalShare from 'components/modals/ModalShare';
import Head from 'components/utilities/Head';
import Amenities from './Amenities';
import Contact from './Contact';
import CourtDetails from './CourtDetails';
import Map from './Map';
import PlaySessions from './PlaySessions';
import { Props } from './types';

export const generateBreadcrumbs = ({
  isForJsonLd,
  venueTitle,
  venueSlug,
  cityName,
  citySlug,
  regionName,
  regionSlug,
  countryId,
  countryName,
  countrySlug,
}: {
  isForJsonLd?: boolean;
  venueTitle: string;
  venueSlug: string;
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
            url: getCityCourtsPageUrl(citySlug || ''),
          },
          {
            label: venueTitle,
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
      {
        name: venueTitle,
        id: getCourtPageUrl(venueSlug),
      },
    ].map((item) => ({
      ...item,
      id: `${process.env.APP_URL}${item.id}`,
    })),
  };
};

const CourtImage = ({ image, venueTitle }: { image: string; venueTitle: string }) => {
  return (
    <NextImage
      src={image}
      alt={venueTitle ? `${venueTitle} pickleball court` : 'Court'}
      className="mb-ds-3xl block h-[13.75rem] w-full object-cover lg:h-[21rem] lg:rounded-xl"
      width={576}
      height={336}
      sizes="(max-width: 768px) 100vw, 576px"
      priority={true}
    />
  );
};

const CourtDescription = ({ description }: { description?: string }) => {
  if (!description) {
    return null;
  }

  return (
    <div className="mb-ds-3xl border-b border-t border-color-border-input-lightmode pb-ds-3xl pt-ds-3xl dark:border-color-border-input-darkmode lg:border-t-0 lg:pt-0">
      {!!description && (
        <p className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {description}
        </p>
      )}
    </div>
  );
};

export default function CourtPageContent({ venue, faqs }: Props) {
  if (!venue) {
    return null;
  }

  const venueId = venue?.id;
  const venueImage = venue?.images[0]?.url || DEFAULT_VENUE_IMAGE;
  const venueTitle = venue?.title;
  const locationShortName = venue?.city?.name
    ? `${venue?.city?.name}, ${venue?.city?.countrySubdivision?.name}`
    : '';
  const { openSignupModal, ModalLogin, ModalSignup } = useAuthModals();
  const {
    isOpen: isShareOpen,
    openModal: openShareModal,
    closeModal: closeShareModal,
  } = useModal();
  const [activePlaySessionId, setActivePlaySessionId] = React.useState<string | null>(null);
  const viewer = useViewer();
  const router = useRouter();
  const [
    getPlaySessionsByVenueIdAsUserLazyQuery,
    { data: playSessionDataAsUser, loading: isLoadingAsUser, error: errorAsUser },
  ] = useGetPlaySessionsByVenueIdAsUserLazyQuery();
  const [
    getPlaySessionsByVenueIdAsAnonymousLazyQuery,
    { data: playSessionDataAsAnonymous, loading: isLoadingAsAnonymous, error: errorAsAnonymous },
  ] = useGetPlaySessionsByVenueIdAsAnonymousLazyQuery();
  const [upsertVenueFollowMutation] = useUpsertVenueFollowMutation();
  const [getUserVenueFollowLazyQuery] = useGetUserVenueFollowLazyQuery();

  const playSessions =
    playSessionDataAsUser?.playSessions || playSessionDataAsAnonymous?.playSessions || [];

  const shareUrl = `${process.env.APP_URL}${getCourtPageUrl(
    venueId,
  )}?utm_source=share&utm_medium=${getPlatform()}utm_campaign=share`;

  React.useEffect(() => {
    if (!viewer.isSessionLoading) {
      if (viewer.isUserSession) {
        getPlaySessionsByVenueIdAsUserLazyQuery({
          variables: {
            venueId: venueId,
            startDateTime: startOfToday().toISOString(),
            userId: viewer.userId,
          },
        });
      } else {
        getPlaySessionsByVenueIdAsAnonymousLazyQuery({
          variables: {
            venueId: venueId,
            startDateTime: startOfToday().toISOString(),
          },
        });
      }
    }
  }, [viewer.isSessionLoading]);

  return (
    <>
      <Head
        title={`Pickleball at ${venueTitle}`}
        description={`Play pickleball at ${venueTitle} in ${locationShortName}.`}
        ogImage={venueImage}
      />
      <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
        <div className="mx-auto px-4 py-ds-lg sm:px-8">
          {!!viewer.userId && typeof window !== 'undefined' && window.history.length > 1 ? (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  pageBackOrFallback({
                    router,
                    fallbackPath: PLAY_PAGE,
                  });
                }}
              >
                <ChevronLeft className="w-6" />
              </button>
              <div className="typography-product-heading ml-6">Location</div>
            </div>
          ) : (
            <div>
              <Breadcrumbs
                breadcrumbs={
                  generateBreadcrumbs({
                    venueTitle,
                    venueSlug: venue?.slug || '',
                    cityName: venue?.city?.name || '',
                    citySlug: venue?.city?.slug || '',
                    regionName: venue?.city?.countrySubdivision?.name || '',
                    regionSlug: venue?.city?.countrySubdivision?.slug || '',
                    countryName: venue?.city?.countrySubdivision?.country?.name || '',
                    countryId: venue?.city?.countrySubdivision?.country?.id || '',
                    countrySlug: venue?.city?.countrySubdivision?.country?.slug || '',
                  }).ui
                }
              />
            </div>
          )}
        </div>
      </div>
      <main className="mx-auto w-full max-w-5xl bg-color-bg-lightmode-primary pb-20 dark:bg-color-bg-darkmode-primary">
        <div className="flex w-full lg:flex-row-reverse lg:pt-8">
          <div className="hidden w-full max-w-md lg:block lg:pl-6">
            <div className="sticky top-16 self-start bg-color-bg-lightmode-primary p-ds-xl dark:bg-color-bg-darkmode-primary">
              <CourtDetails
                venueId={venueId}
                locationShortName={locationShortName}
                addressString={venue.addressString}
                venueTitle={venueTitle}
                access={venue.accessType}
                indoorCourtCount={venue.indoorCourtCount}
                outdoorCourtCount={venue.outdoorCourtCount}
                netType={venue.pickleballNets}
                surfaceType={venue.courtSurfaces.map(({ courtSurface }) => courtSurface)}
                handleNeedsAuth={() => {
                  openSignupModal();
                }}
                shareUrl={shareUrl}
                openShareModal={openShareModal}
              />
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="relative">
              <div className="absolute right-4 top-4 block lg:hidden">
                <Button
                  variant="secondary"
                  isInline
                  size="sm"
                  iconLeft={<Share className="w-4" />}
                  onClick={() => {
                    openShareModal();

                    if (navigator.share) {
                      navigator
                        .share({
                          title: `${venueTitle} on Bounce`,
                          text: `Play pickleball at ${venueTitle}.`,
                          url: shareUrl,
                        })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing:', error));
                    }
                  }}
                >
                  Share
                </Button>
              </div>
              <CourtImage image={venueImage} venueTitle={venueTitle} />
            </div>
            <div className="px-4 lg:p-0">
              <div className="mb-ds-3xl lg:hidden">
                <CourtDetails
                  venueId={venueId}
                  locationShortName={locationShortName}
                  addressString={venue.addressString}
                  venueTitle={venueTitle}
                  access={venue.accessType}
                  indoorCourtCount={venue.indoorCourtCount}
                  outdoorCourtCount={venue.outdoorCourtCount}
                  netType={venue.pickleballNets}
                  surfaceType={venue.courtSurfaces.map(({ courtSurface }) => courtSurface)}
                  handleNeedsAuth={() => {
                    openSignupModal();
                  }}
                  shareUrl={shareUrl}
                  openShareModal={openShareModal}
                />
              </div>
              {/* <CourtDescription description={venue.description} /> */}
              <Amenities amenities={venue.amenities.map((amenity) => amenity.amenity)} />
              <PlaySessions
                venueTitle={venueTitle}
                openSignupModal={openSignupModal}
                playSessions={playSessions}
                setActivePlaySessionId={setActivePlaySessionId}
              />
              <Map addressString={venue.addressString} lat={venue.latitude} lng={venue.longitude} />
              <Contact email={venue.email} phone={venue.phoneNumber} website={venue.websiteUrl} />
            </div>
          </div>
        </div>
        <div className="px-4 lg:px-0">
          <div className="mt-ds-3xl w-full border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode">
            <Link className="inline-block" href={getCityCourtsPageUrl(venue.city?.slug || '')}>
              <h2 className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                Courts in {locationShortName}
              </h2>
            </Link>
            <div className="mt-ds-xl grid grid-cols-1 gap-6 lg:grid-cols-3">
              {venue?.city?.venues
                ?.filter((v) => !!v?.id && v?.id !== venueId)
                .slice(0, 3)
                .map((venue) => {
                  return (
                    <CardVenue
                      key={venue?.id}
                      {...venue}
                      totalCourtCount={venue.indoorCourtCount + venue.outdoorCourtCount}
                      imageUrl={venue?.images[0]?.url}
                    />
                  );
                })}
            </div>
            <div className="mt-ds-xl flex">
              <Link
                href={getCityCourtsPageUrl(venue?.city?.slug || '')}
                className="button-rounded-inline-primary-inverted typography-product-button-label-medium inline-flex min-h-[2.5rem] w-auto items-center px-6"
              >
                View all courts in {locationShortName}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-ds-3xl border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode">
          <Faqs questionsAnswers={faqs} />
        </div>
      </main>
      <Footer isBottomRegister isBottomBarRegisterMobile />
      <ModalPlaySession
        playSessionId={activePlaySessionId}
        closeModal={() => setActivePlaySessionId(null)}
        fetchPlaySessions={() => {
          console.log('fetch play sessions');
        }}
      />
      <ModalLogin isShowSignupLink />
      <ModalSignup
        isShowLoginLink
        handleSignupSuccess={async ({ userId }: { userId: string }) => {
          if (userId && venueId) {
            upsertVenueFollowMutation({
              variables: {
                venueId,
                userId,
                status: FollowStatusesEnum.Active,
              },
            }).then(() => {
              return getUserVenueFollowLazyQuery({
                variables: {
                  userId,
                  venueId,
                },
              });
            });
          }
        }}
      />
      <ModalShare
        isOpen={isShareOpen}
        closeModal={closeShareModal}
        title="Share court"
        shareUrl={shareUrl}
      />
    </>
  );
}
