import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import {
  CourtSurfacesEnum,
  VenueAccessTypesEnum,
  VenueNetsEnum,
  useGetVenuesByGeoLazyQuery,
} from 'types/generated/client';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { milesToMeters } from 'utils/shared/geo/milesToMeters';
import { useGeoLocation } from 'hooks/useGeoLocation';
import CloseIcon from 'svg/CloseIcon';
import CourtFlat from 'svg/CourtFlat';
import List from 'svg/List';
import Map from 'svg/Map';
import { Button, ButtonText } from 'components/Button';
import Footer from 'components/Footer';
import LoadingSkeleton from 'components/LoadingSkeleton';
import CardVenue from 'components/cards/CardVenue';
import TopNav from 'components/nav/TopNav';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import FilterBar from './FilterBar';
import {
  CourtType,
  DEFAULT_COURT_DISTANCE_IMPERIAL,
  VENUE_NETS_OPTIONS,
  VENUE_SURFACE_OPTIONS,
} from './types';

const MemoizedCourtFlat = React.memo(CourtFlat);
const MemoizedCardVenue = React.memo(CardVenue);

enum DisplayView {
  List = 'LIST',
  Map = 'MAP',
}

const getCourtLimit = (venues: { indoorCourtCount: number; outdoorCourtCount: number }[]) => {
  let maxCourts = 0;

  venues.forEach((venue) => {
    const courts = (venue.indoorCourtCount || 0) + (venue.outdoorCourtCount || 0);

    if (courts > maxCourts) {
      maxCourts = courts;
    }
  });

  return maxCourts;
};

const CardLoadingSkeleton = () => {
  return (
    <div className="w-full flex-shrink-0 overflow-hidden rounded-lg lg:max-w-[26rem]">
      <LoadingSkeleton height="11.25rem" />
      <div className="mt-2.5">
        <LoadingSkeleton count={3} />
      </div>
    </div>
  );
};

const loadingSkeletonGrid = [
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
  CardLoadingSkeleton,
];

interface Props {
  h1Title?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function CourtFinder({
  h1Title = 'Pickleball Court Finder',
  metaTitle = 'Pickleball Court Finder',
  metaDescription = 'Discover pickleball courts by location. Access over 15k pickleball courts on Bounce.',
}: Props) {
  const {
    position,
    getEstimatedLocation,
    requestUserLocation,
    centerLatitude,
    centerLongitude,
    isExactCenter,
    hasLocationPermission,
  } = useGeoLocation();
  const [courtType, setCourtType] = React.useState<CourtType[]>([]);
  const [surface, setSurface] = React.useState<CourtSurfacesEnum[]>([]);
  const [nets, setNets] = React.useState<VenueNetsEnum[]>([]);
  const [accessType, setAccessType] = React.useState<VenueAccessTypesEnum[]>([]);
  /**
   * @note over 90% of data says permnanet lines which can't be true. It must count tennis courts too which is bad data.
   */
  // const [lines, setLines] = React.useState('');
  const [courtsMaxNumber, setCourtsMaxNumber] = React.useState(26);
  const [courtsMinNumber, setCourtsMinNumber] = React.useState(1);
  const [showOnlyDedicatedCourts, setShowOnlyDedicatedCourts] = React.useState(false);
  const [showFreeCourts, setShowFreeCourts] = React.useState(false);
  const [getVenuesByGeoLazyQuery, { data, loading, error, called }] = useGetVenuesByGeoLazyQuery();
  const [listHoveredVenueId, setListHoveredVenueId] = React.useState<string | null>(null);
  const [activeVenueId, setActiveVenueId] = React.useState<string | null>(null);
  const [displayView, setDisplayView] = React.useState<DisplayView>(DisplayView.List);
  const [distance, setDistance] = React.useState(DEFAULT_COURT_DISTANCE_IMPERIAL);
  const isMapOpen = displayView === DisplayView.Map;

  const fetchCourts = ({
    longitude,
    latitude,
    distance,
  }: {
    longitude: number;
    latitude: number;
    distance: number;
  }) => {
    getVenuesByGeoLazyQuery({
      fetchPolicy: 'network-only',
      variables: {
        distance,
        from: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    });
  };

  React.useEffect(() => {
    const getInitialCourts = async () => {
      try {
        const canUseExactLocation = await hasLocationPermission();

        // if (!canUseExactLocation) {
        /**
         * @note exact was super slow, so turning on estimate for all cases until we can optimize
         */
        getEstimatedLocation()
          .then((position) => {
            if (position) {
              fetchCourts({
                longitude: position.longitude,
                latitude: position.latitude,
                distance: milesToMeters(DEFAULT_COURT_DISTANCE_IMPERIAL.id),
              });
            }
          })
          .catch(() => {});
        // }

        requestUserLocation()
          .then((position) => {
            if (position) {
              fetchCourts({
                longitude: position.longitude,
                latitude: position.latitude,
                distance: milesToMeters(DEFAULT_COURT_DISTANCE_IMPERIAL.id),
              });
            }
          })
          .catch(() => {
            getEstimatedLocation().then((position) => {
              if (position) {
                fetchCourts({
                  longitude: position.longitude,
                  latitude: position.latitude,
                  distance: milesToMeters(DEFAULT_COURT_DISTANCE_IMPERIAL.id),
                });
              }
            });
          })
          .catch(() => {});
      } catch (error) {
        getEstimatedLocation()
          .then((position) => {
            if (position) {
              fetchCourts({
                longitude: position.longitude,
                latitude: position.latitude,
                distance: milesToMeters(DEFAULT_COURT_DISTANCE_IMPERIAL.id),
              });
            }
          })
          .catch(() => {});
      }
    };

    if (!position) {
      getInitialCourts();
    }
  }, [position]);

  React.useEffect(() => {
    if (!called && position && !data?.venues.length) {
      getVenuesByGeoLazyQuery({
        fetchPolicy: 'network-only',
        variables: {
          distance: milesToMeters(DEFAULT_COURT_DISTANCE_IMPERIAL.id),
          from: {
            type: 'Point',
            coordinates: [centerLongitude, centerLatitude],
          },
        },
      });
    }
  }, [data, position, called]);

  const decoratedVenues = React.useMemo(() => {
    if (!data?.venues || data.venues.length === 0) {
      return [];
    }

    return data.venues.map((venue) => {
      return {
        ...venue,
        distance: calculateHaversineDistance({
          coord1: {
            latitude: centerLatitude || 0,
            longitude: centerLongitude || 0,
          },
          coord2: {
            latitude: venue.geometry.coordinates[1],
            longitude: venue.geometry.coordinates[0],
          },
          unit: 'miles',
        }),
      };
    });
  }, [data?.venues, centerLatitude, centerLongitude]);

  const venues = React.useMemo(() => {
    const limit = getCourtLimit(decoratedVenues);
    const maxCourts = Math.min(limit, courtsMaxNumber);
    const minCourts = Math.min(maxCourts, courtsMinNumber);

    let venues = decoratedVenues.filter((court) => {
      const totalCourts = (court.indoorCourtCount || 0) + (court.outdoorCourtCount || 0);
      return totalCourts >= minCourts && totalCourts <= maxCourts;
    });

    /**
     * @todo Use array instead of showFreeCourts boolean
     */
    venues =
      accessType.length > 0
        ? venues.filter((venue) => {
            return venue.accessType === VenueAccessTypesEnum.Free;
          })
        : venues;

    if (showOnlyDedicatedCourts) {
      venues = venues.filter((venue) => {
        return (
          venue.pickleballNets === VenueNetsEnum.Permanent ||
          venue.pickleballNets === VenueNetsEnum.Tennis
        );
      });
    } else if (nets.length > 0) {
      let netsIncludes: VenueNetsEnum[] = [];

      nets.forEach((net) => {
        const matchingNet = VENUE_NETS_OPTIONS.find((option) => option.id === net);
        if (!matchingNet) {
          return;
        }
        netsIncludes = [...netsIncludes, ...matchingNet?.includedValues];
      });

      venues = venues.filter((venue) => {
        return !!venue.pickleballNets && nets.includes(venue.pickleballNets);
      });
    }

    if (surface.length > 0) {
      let surfacesIncluded: CourtSurfacesEnum[] = [];

      surface.forEach((surface) => {
        const matchingSurface = VENUE_SURFACE_OPTIONS.find((option) => option.id === surface);
        if (!matchingSurface) {
          return;
        }
        surfacesIncluded = [...surfacesIncluded, ...matchingSurface?.includedValues];
      });

      venues = venues.filter((venue) => {
        let hasSurface = false;
        venue.courtSurfaces.forEach((courtSurface) => {
          if (surfacesIncluded.includes(courtSurface.courtSurface)) {
            hasSurface = true;
          }
        });
        return hasSurface;
      });
    }

    if (courtType.length > 0) {
      const isSearchingIndoor = courtType.includes(CourtType.Indoor);
      const isSearchingOutdoor = courtType.includes(CourtType.Outdoor);

      if (!isSearchingIndoor || !isSearchingOutdoor) {
        if (isSearchingIndoor) {
          venues = venues.filter((venue) => {
            return venue.indoorCourtCount > 0;
          });
        }
        if (isSearchingOutdoor) {
          venues = venues.filter((venue) => {
            return venue.outdoorCourtCount > 0;
          });
        }
      }
    }
    /**
     * @todo dedicated nets, indoor/outdoor (check if the other is zero)... see modal
     */

    return venues.sort((a, b) => a.distance - b.distance);
  }, [
    decoratedVenues,
    courtsMinNumber,
    courtsMaxNumber,
    showFreeCourts,
    showOnlyDedicatedCourts,
    surface,
    courtType,
    nets,
    accessType,
  ]);

  const activeVenue = venues.find((venue) => venue.id === activeVenueId);

  const courtLimit = React.useMemo(() => {
    return getCourtLimit(decoratedVenues);
  }, [decoratedVenues]);

  const maxCourts = Math.min(courtLimit, courtsMaxNumber);
  const minCourts = Math.min(maxCourts, courtsMinNumber);

  return (
    <>
      <Head title={metaTitle} description={metaDescription} />
      <div className="flex h-full grow flex-col">
        <TopNav shouldHideNavigation={false} />
        <div className="fixed left-1 top-1 -z-10 text-transparent">
          <h1>{h1Title}</h1>
        </div>
        <main className="h-full">
          <FilterBar
            setSurface={setSurface}
            surface={surface}
            setNets={setNets}
            nets={nets}
            courtType={courtType}
            setCourtType={setCourtType}
            showFreeCourts={showFreeCourts}
            setShowFreeCourts={setShowFreeCourts}
            setAccessType={setAccessType}
            accessType={accessType}
            showOnlyDedicatedCourts={showOnlyDedicatedCourts}
            setShowOnlyDedicatedCourts={setShowOnlyDedicatedCourts}
            courtLimit={courtLimit}
            courtsMinNumber={minCourts}
            setCourtsMinNumber={setCourtsMinNumber}
            courtsMaxNumber={maxCourts}
            setCourtsMaxNumber={setCourtsMaxNumber}
            distance={distance}
            setDistance={setDistance}
            fetchCourts={fetchCourts}
          />
          <div className="flex justify-between">
            <div className="mx-auto flex w-full flex-col pb-8 pt-ds-xl">
              <div className="mx-auto grid w-full grid-cols-1 gap-ds-2xl px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                {loading
                  ? loadingSkeletonGrid.map((Item, i) => <Item key={i} />)
                  : venues.map((venue) => (
                      <div
                        key={venue.id}
                        className={classNames(
                          'w-full flex-shrink-0 overflow-hidden rounded-lg lg:max-w-[26rem]',
                          listHoveredVenueId === venue.id &&
                            'ring-2 ring-color-bg-lightmode-invert ring-offset-8 ring-offset-color-bg-darkmode-invert dark:ring-color-bg-darkmode-invert dark:ring-offset-color-bg-lightmode-invert',
                        )}
                        onMouseEnter={() => setListHoveredVenueId(venue.id)}
                        onMouseLeave={() => setListHoveredVenueId(null)}
                      >
                        {/* Cards */}
                        <MemoizedCardVenue
                          key={venue.id}
                          id={venue.id}
                          slug={venue.slug}
                          imageUrl={venue?.images?.[0]?.url}
                          title={venue.title}
                          addressString={venue.addressString}
                          accessType={venue.accessType}
                          totalCourtCount={venue.indoorCourtCount + venue.outdoorCourtCount}
                          pickleballNets={venue.pickleballNets}
                        />
                      </div>
                    ))}
              </div>
            </div>
            <div className="fixed bottom-8 right-1/2 z-10 block translate-x-1/2 transform lg:hidden">
              <Button
                variant="primary"
                size="md"
                style={{ width: '160px' }}
                className={classNames(
                  'w-[12.5rem] rounded-full bg-color-bg-darkmode-primary px-4 py-2 text-sm text-color-text-lightmode-invert',
                  isMapOpen && !!activeVenue ? 'hidden lg:block' : 'block',
                )}
                onClick={() => {
                  setDisplayView(isMapOpen ? DisplayView.List : DisplayView.Map);
                  setActiveVenueId(null);
                }}
              >
                <div className="hidden items-center justify-center lg:flex">
                  <Map className="h-5 w-5" />
                  <p className="ml-2">{isMapOpen ? 'Hide map' : 'Show map'}</p>
                </div>
                <div className="flex items-center justify-center lg:hidden">
                  {!isMapOpen && <Map className="h-5 w-5" />}
                  {isMapOpen && <List className="h-5 w-5" />}
                  <p className="ml-2">{isMapOpen ? 'Show list' : 'Show map'}</p>
                </div>
              </Button>
            </div>
            <div
              className={classNames(
                'fixed right-0 top-[calc(theme(height.marketplace-nav)+theme(height.topnav))] h-[calc(100vh-theme(height.marketplace-nav)-theme(height.topnav))] w-full lg:sticky lg:max-w-[40rem]',
                isMapOpen ? 'block' : 'hidden lg:block',
              )}
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.GOOGLE_MAPS_API_KEY as string,
                }}
                center={
                  centerLatitude && centerLongitude
                    ? { lat: centerLatitude, lng: centerLongitude }
                    : undefined
                }
                defaultZoom={12}
                options={{
                  gestureHandling: 'greedy',
                }}
              >
                {(typeof window !== 'undefined' ? venues : []).map((venue) => (
                  <div
                    key={venue.id}
                    // @ts-ignore
                    lat={venue.geometry.coordinates[1]}
                    lng={venue.geometry.coordinates[0]}
                    className={classNames(
                      'group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.16)]',
                      listHoveredVenueId === venue.id
                        ? 'z-20 bg-color-bg-lightmode-brand text-color-text-lightmode-invert dark:bg-color-bg-lightmode-brand dark:text-color-text-lightmode-invert'
                        : 'bg-color-bg-lightmode-primary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-secondary',
                    )}
                    onMouseEnter={() => setListHoveredVenueId(venue.id)}
                    onMouseLeave={() => setListHoveredVenueId(null)}
                    onClick={() => setActiveVenueId(venue.id)}
                  >
                    <MemoizedCourtFlat className="h-4 w-4" />
                  </div>
                ))}
                {isExactCenter && (
                  <div
                    className="text-3xl leading-none"
                    /* @ts-ignore */
                    lat={centerLatitude}
                    lng={centerLongitude}
                  >
                    📍
                  </div>
                )}
              </GoogleMapReact>
              {!!activeVenue && (
                <div className="absolute bottom-0 left-1/2 right-1/2 flex w-full max-w-sm -translate-x-1/2 justify-center rounded-t-xl bg-color-bg-lightmode-primary p-ds-lg dark:bg-color-bg-darkmode-primary">
                  <div className="absolute right-6 top-6 z-10 flex items-center justify-center rounded-full bg-color-bg-lightmode-invert bg-opacity-50">
                    <ButtonText
                      onClick={() => setActiveVenueId(null)}
                      className="flex items-center justify-center rounded-full p-2"
                    >
                      <CloseIcon className="h-6 w-6 text-color-text-lightmode-invert" />
                    </ButtonText>
                  </div>
                  <MemoizedCardVenue
                    key={activeVenue.id}
                    id={activeVenue.id}
                    slug={activeVenue.slug}
                    imageUrl={activeVenue?.images?.[0]?.url}
                    title={activeVenue.title}
                    addressString={activeVenue.addressString}
                    accessType={activeVenue.accessType}
                    totalCourtCount={activeVenue.indoorCourtCount + activeVenue.outdoorCourtCount}
                    pickleballNets={activeVenue.pickleballNets}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
