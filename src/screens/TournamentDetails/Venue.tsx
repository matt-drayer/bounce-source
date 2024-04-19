import React from 'react';
import { getCourtPageUrl } from 'constants/pages';
import { CourtSurfacesEnum, VenueNetsEnum } from 'types/generated/client';
import { getBallName } from 'utils/shared/sports/getBallName';
import CourtFlat from 'svg/CourtFlat';
import Nets from 'svg/Net';
import Pickleball from 'svg/Pickleball';
import Surface from 'svg/Surface';
import { ButtonLink } from 'components/Button/Button';
import Link from 'components/Link';
import Map from './Map';
import { EventProps } from './types';

const getNetName = (netType?: VenueNetsEnum | null) => {
  if (!netType) {
    return null;
  }

  if (netType === VenueNetsEnum.BringYourOwn || netType === VenueNetsEnum.Portable) {
    return 'Non-permanent nets';
  } else {
    return 'Permanent nets';
  }
};

const getSurfaceNames = (surfaceType?: CourtSurfacesEnum[] | null) => {
  if (!surfaceType || surfaceType.length === 0) {
    return null;
  }

  return surfaceType.map((s) => s[0] + s.slice(1).toLowerCase()).join(' | ');
};

export default function Venue({ event }: EventProps) {
  if (!event.venue) {
    return null;
  }

  const location = {
    addressString: event.venue.addressString,
    lat: event.venue.latitude,
    lng: event.venue.longitude,
  };

  const courtCounts = [];
  if (event.venue.indoorCourtCount) {
    courtCounts.push(`${event.venue.indoorCourtCount} Indoor`);
  }
  if (event.venue.outdoorCourtCount) {
    courtCounts.push(`${event.venue.outdoorCourtCount} Outdoor`);
  }

  const surfaces = getSurfaceNames(event.venue?.courtSurfaces?.map((s) => s.courtSurface));
  const ballName = getBallName({ ballType: event.ballType, ballCustomName: event.ballCustomName });

  return (
    <>
      <div>
        <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Venue
        </h2>
        {event.venue.title && !event.venue.slug && (
          <p className="typography-product-subheading mt-ds-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {event.venue.title}
          </p>
        )}
        {event.venue.title && event.venue.slug && (
          <Link
            href={getCourtPageUrl(event.venue.slug)}
            className="typography-product-subheading mt-ds-2xl block text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
          >
            {event.venue.title}
          </Link>
        )}
        <div className="mt-ds-lg grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-h-[13.75rem] rounded-md bg-color-bg-lightmode-tertiary px-ds-3xl py-ds-xl dark:bg-color-bg-darkmode-tertiary">
            <p className="typography-product-body-highlight mb-2 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Court details
            </p>
            <div className="space-y-ds-md">
              {courtCounts.length > 0 && (
                <div className="mt-ds-lg flex items-center gap-ds-md">
                  <CourtFlat className="h-5 w-5 text-color-text-lightmode-secondary" />
                  <p className="typography-product-body text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {courtCounts.join(' / ')}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-ds-md">
                <Nets className="h-5 w-5 text-color-text-lightmode-secondary" />
                <p className="typography-product-body text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {getNetName(event.venue.pickleballNets)}
                </p>
              </div>
              {!!surfaces && surfaces.length > 0 && (
                <div className="flex items-center gap-ds-md">
                  <Surface className="h-5 w-5 text-color-text-lightmode-secondary" />
                  <p className="typography-product-body text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {surfaces}
                  </p>
                </div>
              )}
              {!!ballName && (
                <div className="flex items-center gap-ds-md">
                  <Pickleball className="h-5 w-5 text-color-text-lightmode-secondary" />
                  <p className="typography-product-body text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {ballName}
                  </p>
                </div>
              )}
            </div>
          </div>
          {event.venue.images.map((image) => (
            <img
              src={image.url}
              className="h-[13.75rem] w-full rounded-md object-cover object-center"
            />
          ))}
        </div>
        {event.venue?.slug && (
          <div className="mt-ds-lg flex items-center justify-start">
            <ButtonLink
              href={getCourtPageUrl(event.venue.slug)}
              className=""
              isInline
              size="lg"
              variant="secondary"
            >
              Check the venue
            </ButtonLink>
          </div>
        )}
        <div className="mt-ds-2xl">
          <p className="typography-product-subheading mb-ds-lg text-color-bg-darkmode-primary dark:text-color-text-darkmode-primary">
            Location
          </p>
          <Map {...location} />
        </div>
      </div>
    </>
  );
}
