import React from 'react';
import GoogleMapReact from 'google-map-react';
import mobile from 'is-mobile';
import NextImage from 'next/image';
import { getEventUrl } from 'constants/pages';
import { ADDITIONAL_PLAYERS_COUNT } from 'constants/tournaments';
import { EventStatusesEnum } from 'types/generated/client';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { useGeoLocation } from 'hooks/useGeoLocation';
import Calendar from 'svg/Calendar';
import ChevronRight from 'svg/ChevronRight';
import CloseIcon from 'svg/CloseIcon';
import Dot from 'svg/Dot';
import List from 'svg/List';
import LoadSpinner from 'svg/LoadSpinner';
import Location from 'svg/Location';
import Map from 'svg/Map';
import Players from 'svg/Players';
import Trophy from 'svg/Trophy';
import { Button, ButtonText } from 'components/Button';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';
import { GetTournamentsForMarketplaceQuery } from './types';

const DEFAULT_EVENT_IMAGE = '/images/app/default-event.png';

interface AdditionalTournamentDetails {
  startTimestamp: number;
  displayDate: string;
  distance: number;
}

interface Props {
  tournaments: (GetTournamentsForMarketplaceQuery['events'][0] & AdditionalTournamentDetails)[];
  isPageLoaded: boolean;
}

type Tournament = Props['tournaments'][0];
interface CardProps {
  tournamentId: Tournament['id'];
  listHoveredTournamentId: string | null;
  setListHoveredTournamentId: (id: string | null) => void;
  coverImageUrl: string;
  title: Tournament['title'];
  registrationClosedAt: Tournament['registrationClosedAt'];
  startTimestamp: Tournament['startTimestamp'];
  status: Tournament['status'];
  organizerImageUrl: string;
  sourceOrganizerTitle: Tournament['sourceOrganizerTitle'];
  sourceRegistrationCount: Tournament['sourceRegistrationCount'];
  registrationCount: number;
  displayDate: Tournament['displayDate'];
  displayLocation: Tournament['displayLocation'];
  distance: Tournament['distance'];
  isExternal: Tournament['isExternal'];
}

const Card = ({
  tournamentId,
  coverImageUrl,
  organizerImageUrl,
  title,
  registrationClosedAt,
  startTimestamp,
  status,
  sourceOrganizerTitle,
  sourceRegistrationCount,
  registrationCount,
  displayDate,
  displayLocation,
  distance,
  listHoveredTournamentId,
  setListHoveredTournamentId,
  isExternal,
}: CardProps) => {
  return (
    <div
      key={tournamentId}
      className={classNames(
        'w-full flex-shrink-0 overflow-hidden rounded-lg',
        listHoveredTournamentId === tournamentId &&
          'ring-2 ring-color-bg-lightmode-invert ring-offset-8 ring-offset-color-bg-darkmode-invert dark:ring-color-bg-darkmode-invert dark:ring-offset-color-bg-lightmode-invert',
      )}
      onMouseEnter={() => setListHoveredTournamentId(tournamentId)}
      onMouseLeave={() => setListHoveredTournamentId(null)}
    >
      <div className="relative">
        <NextImage
          className="relative h-48 w-full rounded-lg border border-color-border-input-lightmode object-cover object-center dark:border-color-border-input-darkmode"
          /**
           *  @todo use the internal logo
           */
          src={coverImageUrl || DEFAULT_EVENT_IMAGE}
          alt={title}
          loading="lazy"
          height={192}
          width={302}
        />
        {!registrationClosedAt && new Date(startTimestamp).getTime() < Date.now() ? (
          <span className="absolute bottom-0 right-0 rounded-br-lg rounded-tl-lg bg-color-bg-darkmode-invert px-2 py-1 text-sm">
            {status}
          </span>
        ) : status !== EventStatusesEnum.Published ? (
          <span className="absolute bottom-0 right-0 rounded-br-lg rounded-tl-lg bg-color-bg-darkmode-brand px-2 py-1 text-sm text-color-text-lightmode-invert dark:text-color-text-darkmode-invert">
            {status}
          </span>
        ) : null}
      </div>
      <div className="my-2 flex items-center justify-between">
        {organizerImageUrl ? (
          <NextImage
            className="object-fit h-6 w-auto rounded-sm object-cover object-center"
            src={organizerImageUrl}
            alt={sourceOrganizerTitle || ''}
            loading="lazy"
            width={38}
            height={24}
          />
        ) : (
          <div className="typography-product-element-label truncate pr-1 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
            {/**
             *  @todo use our data
             */}
            {sourceOrganizerTitle}
          </div>
        )}
        <p className="typography-product-button-label-xs flex shrink-0 items-center rounded-full bg-color-bg-lightmode-secondary px-ds-sm py-ds-xs text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-secondary">
          <span className="mr-1">
            <Players className="h-4 w-4" />
          </span>
          {(isExternal
            ? sourceRegistrationCount
            : (registrationCount || 0) + ADDITIONAL_PLAYERS_COUNT) || 0}{' '}
          Players
        </p>
      </div>
      <div className="mt-2 flex flex-col">
        <h3 className="typography-product-subheading mb-2 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {title}
        </h3>
        <div className="space-y-1">
          <p className="typography-product-caption flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            <span className="mr-2">
              <Calendar className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
            </span>
            {displayDate}
          </p>
          <p className="typography-product-caption flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            <span className="mr-2">
              <Location className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
            </span>
            {
              /**
               *  @todo use our location data
               */
              displayLocation
            }
            <span className="mx-1.5">
              <Dot className="h-1 w-1" />
            </span>
            <span className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {distance}mi
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const MemoizedCard = React.memo(Card);
const MemoizedTrophy = React.memo(Trophy);

export default function TournamentList({ tournaments, isPageLoaded }: Props) {
  const { centerLatitude, centerLongitude, isExactCenter } = useGeoLocation();
  const [listHoveredTournamentId, setListHoveredTournamentId] = React.useState<string | null>(null);
  const [activeTournamentId, setActiveTournamentId] = React.useState<string | null>(null);
  const [hasOpenedMap, setHasOpenedMap] = React.useState<boolean>(false);
  const [isOpenMap, setIsOpenMap] = React.useState<boolean>(true);
  const [isMobileMapOpen, setIsMobileMapOpen] = React.useState<boolean>(false);
  const activeTournament = React.useMemo(
    () =>
      !activeTournamentId
        ? null
        : tournaments.find((tournament) => tournament.id === activeTournamentId),
    [tournaments, activeTournamentId],
  );

  React.useEffect(() => {
    if (!hasOpenedMap && centerLatitude && centerLongitude) {
      const isMobile = mobile({
        tablet: true,
      });

      if (!isMobile) {
        setHasOpenedMap(true);
        setIsOpenMap(true);
      }
    }
  }, [hasOpenedMap, centerLatitude, centerLongitude]);

  const toggleMap = () => {
    const isMobile = mobile({
      tablet: true,
    });
    const mapState = isMobile ? isMobileMapOpen : isOpenMap;

    setIsOpenMap(!mapState);
    setIsMobileMapOpen(!mapState);
  };

  return (
    <>
      <div className="flex justify-between">
        <div
          className={classNames(
            'mx-auto grid gap-ds-2xl px-ds-lg pb-16 pt-ds-2xl',
            isOpenMap && 'grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
            !isOpenMap && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {tournaments &&
            tournaments.length > 0 &&
            tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                className="block lg:max-w-[22rem]"
                href={getEventUrl(tournament.id)}
              >
                <MemoizedCard
                  listHoveredTournamentId={listHoveredTournamentId}
                  setListHoveredTournamentId={setListHoveredTournamentId}
                  tournamentId={tournament.id}
                  coverImageUrl={
                    tournament.coverImagePath
                      ? getImageUrl({
                          url: `${process.env.CLOUDFLARE_PUBLIC_URL}${tournament.coverImagePath}`,
                          path: tournament.coverImagePath,
                        })
                      : ''
                  }
                  organizerImageUrl={
                    tournament.organizerImagePath
                      ? getImageUrl({
                          url: `${process.env.CLOUDFLARE_PUBLIC_URL}${tournament.organizerImagePath}`,
                          path: tournament.organizerImagePath,
                        })
                      : ''
                  }
                  title={tournament.title}
                  registrationClosedAt={tournament.registrationClosedAt}
                  startTimestamp={tournament.startTimestamp}
                  status={tournament.status}
                  sourceOrganizerTitle={tournament.sourceOrganizerTitle}
                  sourceRegistrationCount={tournament.sourceRegistrationCount}
                  registrationCount={tournament.registrationsAggregate?.aggregate?.count || 0}
                  isExternal={tournament.isExternal}
                  displayDate={tournament.displayDate}
                  displayLocation={
                    tournament.city?.name && tournament.city?.countrySubdivision?.code
                      ? `${tournament.city?.name}, ${tournament.city?.countrySubdivision?.code}`
                      : tournament.displayLocation
                  }
                  distance={tournament.distance}
                />
              </Link>
            ))}
        </div>
        {isPageLoaded && (
          <Button
            variant="primary"
            size="md"
            isInline
            disabled={!isPageLoaded}
            className={classNames(
              'fixed bottom-8 right-1/2 z-10 min-w-[12rem] translate-x-1/2 transform rounded-full bg-color-bg-darkmode-primary px-4 py-2 text-sm text-color-text-lightmode-invert',
              isPageLoaded && '',
              isOpenMap && !!activeTournament ? 'hidden lg:block' : 'block',
            )}
            onClick={() => {
              if (!isPageLoaded) {
                return;
              }

              toggleMap();
              setActiveTournamentId(null);
            }}
          >
            <div className="hidden items-center justify-center lg:flex">
              <Map className="h-5 w-5" />
              <p className="ml-2">{isOpenMap ? 'Hide map' : 'Show map'}</p>
            </div>
            <div className="flex items-center justify-center lg:hidden">
              {!isMobileMapOpen && <Map className="h-5 w-5" />}
              {isMobileMapOpen && <List className="h-5 w-5" />}
              <p className="ml-2">{isMobileMapOpen ? 'Show list' : 'Show map'}</p>
            </div>
          </Button>
        )}
        {!isPageLoaded && (
          <div className="fixed bottom-8 right-1/2 z-10 w-full max-w-[26rem] translate-x-1/2 transform px-4">
            <Button
              variant="primary"
              size="md"
              disabled={!isPageLoaded}
              className={classNames(
                'min-w-[12rem] rounded-full bg-color-bg-darkmode-primary px-4 py-2 text-sm text-color-text-lightmode-invert',
                isPageLoaded && '',
                isOpenMap && !!activeTournament ? 'hidden lg:block' : 'block',
              )}
              onClick={() => {}}
            >
              <div className="flex w-full flex-nowrap items-center justify-center">
                <LoadSpinner className="h-5 w-5 animate-spin" />
                <p className="ml-2">Finding tournaments near you...</p>
              </div>
            </Button>
          </div>
        )}
        <div
          className={classNames(
            'fixed right-0 top-[calc(theme(height.marketplace-nav)+theme(height.topnav))] h-[calc(100vh-theme(height.marketplace-nav)-theme(height.topnav))] w-full lg:sticky lg:max-w-[40rem]',
            isMobileMapOpen ? 'block' : 'hidden lg:block',
            isPageLoaded && !isOpenMap && 'hidden lg:hidden',
          )}
        >
          {!isPageLoaded && <div className="flex h-full w-full">&nbsp;</div>}
          {isPageLoaded && (isOpenMap || isMobileMapOpen) && (
            <>
              <div className="absolute left-6 top-6 z-10 hidden lg:block">
                <ButtonText
                  onClick={() => {
                    setIsOpenMap(false);
                    setIsMobileMapOpen(false);
                    setActiveTournamentId(null);
                  }}
                  className="rounded-full bg-color-bg-lightmode-primary p-2.5 text-color-text-lightmode-primary shadow-[0px_4px_20px_0px_rgba(0,0,0,0.16);]"
                >
                  <ChevronRight className="w-5" />
                </ButtonText>
              </div>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.GOOGLE_MAPS_API_KEY as string,
                }}
                center={
                  centerLatitude && centerLongitude
                    ? { lat: centerLatitude, lng: centerLongitude }
                    : undefined
                }
                defaultZoom={8}
                options={{
                  gestureHandling: 'greedy',
                }}
                /**
                 * @todo add back map drag? How to work with hook? probably and updateCenter hook
                 */
                // onDragEnd={(map) => {
                //   const center = map.getCenter();
                //   const lat = center.lat();
                //   const lng = center.lng();
                //   setCenterLatitude(lat);
                //   setCenterLongitude(lng);

                //   return fetch(
                //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
                //   )
                //     .then((response) => response.json())
                //     .then((data) => {
                //       if (data.results && data.results.length > 0) {
                //         const addressParts = extractAddressParts(data.results[0]);
                //         setAddressString(`${addressParts.city}, ${addressParts.state}`);
                //       }
                //     })
                //     .catch((error) => console.error('Error:', error));
                // }}
              >
                {(isPageLoaded && centerLatitude && centerLongitude ? tournaments : []).map(
                  (tournamentData) => (
                    <div
                      key={tournamentData.id}
                      // @ts-ignore
                      lat={tournamentData.latitude}
                      lng={tournamentData.longitude}
                      className={classNames(
                        'group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.16)]',
                        listHoveredTournamentId === tournamentData.id
                          ? 'z-20 bg-color-bg-lightmode-brand text-color-text-lightmode-invert dark:bg-color-bg-lightmode-brand dark:text-color-text-lightmode-invert'
                          : 'bg-color-bg-lightmode-primary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-secondary',
                      )}
                      onMouseEnter={() => setListHoveredTournamentId(tournamentData.id)}
                      onMouseLeave={() => setListHoveredTournamentId(null)}
                      onClick={() => setActiveTournamentId(tournamentData.id)}
                    >
                      <MemoizedTrophy className="w-5" />
                    </div>
                  ),
                )}
                {isExactCenter && !!centerLatitude && !!centerLongitude && (
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
            </>
          )}
          {!!activeTournament && (
            <div className="absolute bottom-0 left-1/2 right-1/2 flex w-full max-w-md -translate-x-1/2 justify-center rounded-t-xl bg-color-bg-lightmode-primary p-ds-lg dark:bg-color-bg-darkmode-primary">
              <div className="absolute right-6 top-6 z-10 flex items-center justify-center rounded-full bg-color-bg-lightmode-invert bg-opacity-50">
                <ButtonText
                  onClick={() => setActiveTournamentId(null)}
                  className="flex items-center justify-center rounded-full p-2"
                >
                  <CloseIcon className="h-6 w-6 text-color-text-lightmode-invert" />
                </ButtonText>
              </div>
              <Link
                key={activeTournament.id}
                className="w-full"
                href={getEventUrl(activeTournament.id)}
              >
                <MemoizedCard
                  tournamentId={activeTournament.id}
                  coverImageUrl={
                    activeTournament.coverImagePath
                      ? getImageUrl({
                          url: `${process.env.CLOUDFLARE_PUBLIC_URL}${activeTournament.coverImagePath}`,
                          path: activeTournament.coverImagePath,
                        })
                      : ''
                  }
                  organizerImageUrl={
                    activeTournament.organizerImagePath
                      ? getImageUrl({
                          url: `${process.env.CLOUDFLARE_PUBLIC_URL}${activeTournament.organizerImagePath}`,
                          path: activeTournament.organizerImagePath,
                        })
                      : ''
                  }
                  title={activeTournament.title}
                  registrationClosedAt={activeTournament.registrationClosedAt}
                  startTimestamp={activeTournament.startTimestamp}
                  status={activeTournament.status}
                  sourceOrganizerTitle={activeTournament.sourceOrganizerTitle}
                  sourceRegistrationCount={activeTournament.sourceRegistrationCount}
                  registrationCount={activeTournament.registrationsAggregate?.aggregate?.count || 0}
                  isExternal={activeTournament.isExternal}
                  displayDate={activeTournament.displayDate}
                  displayLocation={
                    activeTournament.city?.name && activeTournament.city?.countrySubdivision?.code
                      ? `${activeTournament.city?.name}, ${activeTournament.city?.countrySubdivision?.code}`
                      : activeTournament.displayLocation
                  }
                  distance={activeTournament.distance}
                  listHoveredTournamentId={null}
                  setListHoveredTournamentId={() => {}}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
