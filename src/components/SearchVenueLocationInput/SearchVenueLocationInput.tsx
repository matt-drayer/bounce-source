import * as React from 'react';
import { useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { GetVenuesByGeoQuery } from 'types/generated/client';
import { useCourtsGeo } from 'hooks/useCourtsGeo';
import { useGeoLocation } from 'hooks/useGeoLocation';
import classNames from 'styles/utils/classNames';

type Props = {
  onSearch(venues: GetVenuesByGeoQuery['venues']): void;
};

const SearchVenueLocationInput = ({ onSearch }: Props) => {
  // const {
  //   position,
  //   getEstimatedLocation,
  //   requestUserLocation,
  //   centerLatitude,
  //   centerLongitude,
  //   isExactCenter,
  //   hasLocationPermission,
  // } = useGeoLocation();
  //
  // console.log(
  //   position,
  //   getEstimatedLocation,
  //   requestUserLocation,
  //   centerLatitude,
  //   centerLongitude,
  //   isExactCenter,
  //   hasLocationPermission,
  // );

  const {
    venues,
    setSuggestedAddresses,
    activeAddress,
    handleSubmit,
    suggestedAddresses,
    setActiveAddress,
    setAddressString,
    addressString,
    isDisabled,
    getAutocompletePlaces,
  } = useCourtsGeo();

  useEffect(() => {
    onSearch(venues);
  }, [venues]);

  return (
    <div className="w-full">
      <div className="font-bod font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        Location
      </div>
      <Combobox
        as="div"
        className="w-full"
        value={activeAddress}
        onChange={async (address) => {
          console.log('--- ADDRESS = ', address);
          setActiveAddress(address);
          setAddressString(address?.description || '');
          handleSubmit(address);
        }}
      >
        <Combobox.Label className="hidden text-sm font-medium leading-6 text-gray-900">
          Address
        </Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className={classNames('input-base-form')}
            placeholder="Enter address..."
            onChange={async (e) => {
              console.log('--- CHANGE = ', e, e.target.value);
              console.log('--- IS DISABLED = ', isDisabled);
              if (isDisabled) return;

              setAddressString(e.target.value);
              setActiveAddress(null);

              if (e.target.value.length > 2) {
                const predictions = await getAutocompletePlaces(e.target.value);
                setSuggestedAddresses(predictions || []);
              }
            }}
            value={addressString}
            displayValue={(a: google.maps.places.AutocompletePrediction | null) =>
              a?.description || addressString
            }
          />
          {suggestedAddresses?.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-3xl bg-white py-4 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {suggestedAddresses.map((address) => (
                <Combobox.Option
                  key={address.place_id}
                  value={address}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9',
                      active ? 'bg-logo-green text-gray-900' : 'text-gray-900',
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span className={classNames('block truncate', selected && 'font-semibold')}>
                        {address.description}
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default SearchVenueLocationInput;
