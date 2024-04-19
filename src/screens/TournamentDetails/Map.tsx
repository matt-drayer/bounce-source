import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import { getGoogleMapsAddressUrl } from 'utils/shared/location/getGoogleMapsAddressUrl';
import Directions from 'svg/Directions';
import Link from 'components/Link';

interface MapProps {
  addressString: string;
  lat: number;
  lng: number;
}

export default function Map({ addressString, lat, lng }: MapProps) {
  return (
    <div className="border-color-border-input-lightmode dark:border-color-border-input-darkmode">
      <div className="h-[21rem] overflow-hidden rounded-xl bg-color-text-lightmode-placeholder dark:bg-color-text-darkmode-placeholder">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.GOOGLE_MAPS_API_KEY as string,
          }}
          defaultCenter={{
            lat: +lat,
            lng: +lng,
          }}
          defaultZoom={15}
          options={{
            mapId: process.env.GOOGLE_MAPS_MAP_ID,
          }}
        >
          {/*@ts-ignore*/}
          <div lat={+lat} lng={+lng}>
            <img src="/images/tournaments/Location.svg" width={30} height={31} alt="" />
          </div>
        </GoogleMapReact>
      </div>
      <Link className="block" isExternal href={getGoogleMapsAddressUrl(addressString)}>
        <h3 className="typography-product-body-highlight mt-ds-lg flex items-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          <Directions className="mr-1 h-6 w-6" /> {addressString}
        </h3>
      </Link>
    </div>
  );
}
