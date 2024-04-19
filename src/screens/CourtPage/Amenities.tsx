import * as React from 'react';
import { AmenitiesEnum } from 'types/generated/client';
import Key from 'svg/Key';
import License from 'svg/License';
import Lights from 'svg/Lights';
import Restaurant from 'svg/Restaurant';
import Restroom from 'svg/Restroom';
import Shop from 'svg/Shop';
import Water from 'svg/Water';
import Wheelchair from 'svg/Wheelchair';

const AmenityItem = ({
  Icon,
  name,
}: {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
}) => {
  return (
    <div className="flex items-center">
      <Icon className="mr-2 h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
      <span className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        {name}
      </span>
    </div>
  );
};

type AmenitiesProps = {
  amenities: AmenitiesEnum[];
};

export default function Amenities({ amenities }: AmenitiesProps) {
  const hasAnyAmenities = !!amenities && amenities.length > 0;

  if (!hasAnyAmenities) {
    return null;
  }

  return (
    <div className="mb-ds-3xl">
      <h3 className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        Location details
      </h3>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {amenities.includes(AmenitiesEnum.Lights) && <AmenityItem Icon={Lights} name="Lights" />}
        {amenities.includes(AmenitiesEnum.Water) && <AmenityItem Icon={Water} name="Water" />}
        {amenities.includes(AmenitiesEnum.WheelchairAccessible) && (
          <AmenityItem Icon={Wheelchair} name="Accessible" />
        )}
        {amenities.includes(AmenitiesEnum.Food) && <AmenityItem Icon={Restaurant} name="Food" />}
        {amenities.includes(AmenitiesEnum.LockerRooms) && (
          <AmenityItem Icon={Key} name="Locker rooms" />
        )}
        {amenities.includes(AmenitiesEnum.ProShop) && <AmenityItem Icon={Shop} name="Pro shop" />}
        {amenities.includes(AmenitiesEnum.Training) && (
          <AmenityItem Icon={License} name="Trainers" />
        )}
        {amenities.includes(AmenitiesEnum.Restrooms) && (
          <AmenityItem Icon={Restroom} name="Restrooms" />
        )}
      </div>
    </div>
  );
}
