import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { debounce } from 'lodash';
import { hasLocationPermission } from 'utils/client/hasLocationPermission';
import { requestUserLocation } from 'utils/client/requestUserLocation';
import { extractAddressParts } from 'utils/shared/geo/extractAddressParts';
import { Position, useGeoLocationState } from 'context/GeoLocationContext';

const DEFAULT_AUTOCOMPLETE_DEBOUNCE_TIME = 400;

interface Props {
  autocompleteDebounceTime?: number;
}

export const useGeoLocation = (
  { autocompleteDebounceTime = DEFAULT_AUTOCOMPLETE_DEBOUNCE_TIME }: Props = {
    autocompleteDebounceTime: DEFAULT_AUTOCOMPLETE_DEBOUNCE_TIME,
  },
) => {
  const [suggestedAddresses, setSuggestedAddresses] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [activeAutocompleteAddress, setActiveAutocompleteAddress] =
    useState<google.maps.places.AutocompletePrediction | null>(null);
  const geolocationState = useGeoLocationState();
  const {
    addressString,
    setPosition,
    setExactAddress,
    setErrorRequestLocation,
    setIsExactCenter,
    setAddressString,
  } = geolocationState;

  const getAddressFromLatLng = async (latitude: number, longitude: number) => {
    try {
      const addressFromLatLngResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      );
      const addressFromLatLng = await addressFromLatLngResponse.json();
      if (addressFromLatLng.results && addressFromLatLng.results.length > 0) {
        const addressParts = extractAddressParts(addressFromLatLng.results[0]);
        setAddressString(`${addressParts.city}, ${addressParts.state} ${addressParts.zipcode}`);
      }
    } catch (error) {
      /**
       * @todo handle error
       */
    }
  };

  const requestUserLocationAndUpdateState = async () => {
    return requestUserLocation()
      .then((geo) => {
        return new Promise((resolve: (value: Position | null) => any) => {
          if (geo) {
            const latitude = geo.coords.latitude;
            const longitude = geo.coords.longitude;
            const position = {
              latitude: latitude,
              longitude: longitude,
            };

            setPosition(position);
            setIsExactCenter(true);
            getAddressFromLatLng(latitude, longitude);

            return resolve(position);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (geo) => {
                const latitude = geo.coords.latitude;
                const longitude = geo.coords.longitude;
                const position = {
                  latitude: latitude,
                  longitude: longitude,
                };

                setPosition(position);
                setIsExactCenter(true);

                return resolve(position);
              },
              (error) => {
                setErrorRequestLocation(error);
                return resolve(null);
              },
            );
          } else {
            return resolve(null);
          }
        });
      })
      .catch((error) => {
        /**
         * @todo should this be separate error from the estimated location?
         */
        setErrorRequestLocation(error);
      });
  };

  const getEstimatedLocation = async () => {
    return (
      fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`,
        {
          method: 'POST',
        },
      )
        .then((response) => response.json())
        .then(async (data) => {
          const latitude = data.location.lat;
          const longitude = data.location.lng;
          const position = {
            latitude: latitude,
            longitude: longitude,
          };

          setPosition(position);
          getAddressFromLatLng(latitude, longitude);

          return position;
        })
        /**
         * @todo should this be separate error from the exact location?
         */
        .catch((error) => setErrorRequestLocation(error))
    );
  };

  const getImmediateAutcompletePlaces = async (
    input: string,
  ): Promise<google.maps.places.AutocompletePrediction[]> => {
    return new Promise((resolve) => {
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
      }

      const options = {};

      const autocompleteService = new window.google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions({ input, ...options }, (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          captureException(new Error('Google Maps Error:' + ' ' + status));
          return;
        }

        setSuggestedAddresses(predictions || []);
        resolve(predictions || []);
      });
    });
  };

  const getAutocompletePlaces = debounce(getImmediateAutcompletePlaces, autocompleteDebounceTime);

  const getExactDetails = (placeId: string): Promise<google.maps.places.PlaceResult | null> => {
    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          captureException(new Error('Google Maps Error:' + ' ' + status));
        }
      });
    });
  };

  const handleSubmitAutocomplete = async (
    address?: google.maps.places.AutocompletePrediction | null,
  ) => {
    setAddressString(address?.description || '');

    try {
      let addressForFetch = address;

      if (!addressForFetch) {
        const finalAddress = await getImmediateAutcompletePlaces(addressString);
        addressForFetch = finalAddress[0];
        setActiveAutocompleteAddress(addressForFetch);
      }

      const exactAddressResp = await getExactDetails(addressForFetch?.place_id || '');

      if (!exactAddressResp || !exactAddressResp.geometry || !exactAddressResp.geometry.location) {
        return;
      }

      setExactAddress(exactAddressResp);

      const newLatitude = exactAddressResp.geometry.location.lat();
      const newLongitude = exactAddressResp.geometry.location.lng();
      const position = {
        latitude: newLatitude,
        longitude: newLongitude,
      };
      setPosition(position);
      setIsExactCenter(true);

      return position;
    } catch (error) {
      captureException(error);
    }
  };

  const handleAutcompleteSuggestions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressString(event.target.value);
    setActiveAutocompleteAddress(null);

    if (event.target.value.length > 2) {
      const predictions = await getAutocompletePlaces(event.target.value);
      setSuggestedAddresses(predictions || []);
    }
  };

  return {
    getExactDetails,
    requestUserLocation: requestUserLocationAndUpdateState,
    getEstimatedLocation,
    getAutocompletePlaces,
    suggestedAddresses,
    activeAutocompleteAddress,
    handleSubmitAutocomplete,
    handleAutcompleteSuggestions,
    hasLocationPermission,
    ...geolocationState,
  };
};
