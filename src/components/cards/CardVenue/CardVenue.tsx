import * as React from 'react';
import NextImage from 'next/image';
import { getCourtPageUrl } from 'constants/pages';
import { DEFAULT_VENUE_IMAGE } from 'constants/venues';
import { VenueAccessTypesEnum, VenueNetsEnum } from 'types/generated/client';
import { pluralize } from 'utils/shared/pluralize';
import { getAccessParamters } from 'utils/shared/venues';
import CourtFlat from 'svg/CourtFlat';
import Location from 'svg/Location';
import Net from 'svg/Net';
import Link from 'components/Link';

interface Props {
  id: string;
  slug: string;
  imageUrl?: string;
  title: string;
  addressString: string;
  accessType?: VenueAccessTypesEnum | null;
  totalCourtCount?: number;
  pickleballNets?: VenueNetsEnum | null;
  isLink?: boolean;
}

const Item = ({
  name,
  Icon,
}: {
  name: string | number;
  Icon: ({ className }: React.SVGProps<SVGSVGElement>) => JSX.Element;
}) => {
  return (
    <div className="mr-ds-md flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
      <Icon className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-lightmode-icon" />{' '}
      <span className="typography-product-caption">{name}</span>
    </div>
  );
};

const Content = ({
  imageUrl,
  title,
  addressString,
  accessType,
  totalCourtCount,
  pickleballNets,
}: Props) => {
  const accessParameters = getAccessParamters(accessType);

  return (
    <div className="w-full">
      <div>
        <NextImage
          src={imageUrl || DEFAULT_VENUE_IMAGE}
          alt={title}
          className="h-[11.25rem] w-full rounded-lg object-cover"
          loading="lazy"
          height={180}
          width={326}
        />
      </div>
      <div className="mt-ds-sm flex text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        <Location className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
        <span className="typography-product-caption">{addressString}</span>
      </div>
      <div className="typography-product-heading-compact mt-ds-sm text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        {title}
      </div>
      <div className="mt-ds-sm flex flex-wrap">
        {!!accessParameters && <Item {...accessParameters} />}
        {!!totalCourtCount && (
          <Item
            name={pluralize({
              count: totalCourtCount,
              singular: 'Court',
              plural: 'Courts',
            })}
            Icon={CourtFlat}
          />
        )}
        {!!pickleballNets && (
          <Item
            name={
              pickleballNets === VenueNetsEnum.Permanent || pickleballNets === VenueNetsEnum.Tennis
                ? 'Permanent nets'
                : 'Non-permanent nets'
            }
            Icon={Net}
          />
        )}
      </div>
    </div>
  );
};

export default function CardVenue({ isLink = true, ...props }: Props) {
  if (isLink) {
    return (
      <Link href={getCourtPageUrl(props.slug)} className="w-full">
        <Content {...props} />
      </Link>
    );
  }

  return <Content {...props} />;
}
