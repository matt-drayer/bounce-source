import * as React from 'react';
import NextImage from 'next/image';
import { getCourtPageUrl } from 'constants/pages';
import { DEFAULT_VENUE_IMAGE } from 'constants/venues';
import { VenueNetsEnum } from 'types/generated/client';
import { CourtSurfacesEnum } from 'types/generated/client';
import { GetVenueBySlugQuery } from 'types/generated/server';
import { getPlatform } from 'utils/mobile/getPlatform';
import { getGoogleMapsAddressUrl } from 'utils/shared/location/getGoogleMapsAddressUrl';
import { getAccessParamters } from 'utils/shared/venues';
import { useModal } from 'hooks/useModal';
import CourtFlat from 'svg/CourtFlat';
import Directions from 'svg/Directions';
import Location from 'svg/Location';
import Net from 'svg/Net';
import Share from 'svg/Share';
import Surface from 'svg/Surface';
import Link from 'components/Link';
import ModalShare from 'components/modals/ModalShare';

interface Props {
  imageUrl: string;
  venue: GetVenueBySlugQuery['venues'][0];
}

const Item = ({
  name,
  Icon,
}: {
  name: string | number;
  Icon: ({ className }: React.SVGProps<SVGSVGElement>) => JSX.Element;
}) => {
  return (
    <div className="mb-ds-sm mr-ds-md flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary dark:text-color-text-darkmode-secondary">
      <Icon className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-lightmode-icon" />{' '}
      <span className="typography-product-caption">{name}</span>
    </div>
  );
};

const getSurfaceNames = (surfaceType?: CourtSurfacesEnum[] | null) => {
  if (!surfaceType || surfaceType.length === 0) {
    return null;
  }

  return surfaceType.map((s) => s[0] + s.slice(1).toLowerCase()).join(' | ');
};

export default function CardVenueSelected({ imageUrl, venue }: Props) {
  const {
    isOpen: isShareOpen,
    openModal: openShareModal,
    closeModal: closeShareModal,
  } = useModal();

  const shareUrl = `${process.env.APP_URL}${getCourtPageUrl(
    venue.id,
  )}?utm_source=share&utm_medium=${getPlatform()}utm_campaign=share`;

  const accessParameters = getAccessParamters(venue.accessType);

  const totalCourtCount = venue.indoorCourtCount + venue.outdoorCourtCount;

  return (
    <>
      <ModalShare
        isOpen={isShareOpen}
        closeModal={closeShareModal}
        title="Share court"
        shareUrl={shareUrl}
      />

      <div className="w-full rounded-md bg-color-bg-lightmode-primary p-4">
        <div className="mb-ds-3xl">
          <NextImage
            src={imageUrl || DEFAULT_VENUE_IMAGE}
            alt={venue.title}
            className="h-[11.25rem] w-full rounded-lg object-cover"
            loading="lazy"
            height={180}
            width={326}
          />
        </div>

        <div className="flex items-start">
          <div className="flex pr-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            <Location className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
            <span className="typography-product-caption">{venue.addressString}</span>
          </div>
          <div className="flex items-center space-x-ds-lg text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            <Link
              className="typography-product-button-label-small flex items-center leading-none"
              isExternal
              href={getGoogleMapsAddressUrl(venue.addressString)}
            >
              <Directions className="mr-1 h-4 w-4" /> Direction
            </Link>
            <button
              className="typography-product-button-label-small hidden items-center leading-none lg:flex"
              type="button"
              onClick={() => {
                openShareModal();

                if (navigator.share) {
                  navigator
                    .share({
                      title: `${venue.title} on Bounce`,
                      text: `Play pickleball at ${venue.title}.`,
                      url: shareUrl,
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing:', error));
                }
              }}
            >
              <Share className="mr-1 h-4 w-4" /> Share
            </button>
          </div>
        </div>
        <div className="typography-product-heading mt-ds-md text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {venue.title}
        </div>

        <div className="mt-ds-3xl flex flex-col">
          {!!accessParameters && <Item {...accessParameters} />}
          {!!totalCourtCount && (
            <Item
              name={`Courts ${venue.outdoorCourtCount} outdoor / ${venue.indoorCourtCount} indoor`}
              Icon={CourtFlat}
            />
          )}
          {!!venue.pickleballNets && (
            <Item
              name={
                venue.pickleballNets === VenueNetsEnum.Permanent ||
                venue.pickleballNets === VenueNetsEnum.Tennis
                  ? 'Permanent nets'
                  : 'Non-permanent nets'
              }
              Icon={Net}
            />
          )}
          {!!venue.courtSurfaces && (
            <Item
              name={`Surface ${getSurfaceNames(
                venue.courtSurfaces.map(({ courtSurface }) => courtSurface),
              )}`}
              Icon={Surface}
            />
          )}
          {/*{surfaceType && surfaceType.length > 0 && (*/}
          {/*  // <Item name={`Surface ${venue.courtSurfaces.join(' /')}`} Icon={Surface} />*/}

          {/*  <div className="typography-product-body flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary dark:text-color-text-darkmode-secondary">*/}
          {/*    <Surface className="mr-ds-md h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}*/}
          {/*    {getSurfaceNames(surfaceType)}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>

        {/*<div className="border-b border-color-border-input-lightmode"></div>*/}
        {/*<Contact*/}
        {/*  email={venue.email}*/}
        {/*  header="Contacts"*/}
        {/*  phone={venue.phoneNumber}*/}
        {/*  website={venue.websiteUrl}*/}
        {/*/>*/}
      </div>
    </>
  );
}
