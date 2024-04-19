import * as React from 'react';
import { captureException } from '@sentry/nextjs';
import { debounce } from 'lodash';
import { RequestStatus } from 'constants/requests';
import { useGetVenuesByGeoLazyQuery } from 'types/generated/client';
import { requestUserLocation } from 'utils/client/requestUserLocation';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { useGetIpAddress } from 'hooks/useGetIpAddress';

const DISTANCE_TO_COURTS = 20;

function milesToMeters(miles: number): number {
  return miles * 1609.34;
}

const extractAddressParts = (placeResult: google.maps.places.PlaceResult) => {
  const addressComponents = placeResult.address_components || [];
  let street = '';
  let city = '';
  let state = '';
  let zipcode = '';

  addressComponents.forEach((component) => {
    const componentType = component.types[0];

    if (componentType === 'street_number' || componentType === 'route') {
      street = `${component.long_name} ${street}`;
    }

    if (componentType === 'locality') {
      city = component.long_name;
    }

    if (componentType === 'administrative_area_level_1') {
      state = component.short_name;
    }

    if (componentType === 'postal_code') {
      zipcode = component.long_name;
    }
  });

  return {
    street,
    city,
    state,
    zipcode,
  };
};

export const useCourtsGeo = () => {
  const [getVenuesByGeoLazyQuery, { data, loading, error }] = useGetVenuesByGeoLazyQuery();
  const [centerLatitude, setCenterLatitude] = React.useState(0);
  const [centerLongitude, setCenterLongitude] = React.useState(0);
  const [isExactCenter, setIsExactCenter] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const { ipResponse } = useGetIpAddress();
  const [mapsRequestStatus, setMapsRequestStatus] = React.useState<RequestStatus>(
    RequestStatus.Idle,
  );
  const [addressString, setAddressString] = React.useState('');
  const [suggestedAddresses, setSuggestedAddresses] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [activeAddress, setActiveAddress] =
    React.useState<google.maps.places.AutocompletePrediction | null>(null);
  const [exactAddress, setExactAddress] = React.useState<google.maps.places.PlaceResult>();
  const isDisabled = false;

  console.log('data: ', data, error);
  React.useEffect(() => {
    fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`,
      {
        method: 'POST',
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('+++++++++++ GEO DATA:', data);
        // Initialize Google Map with received location
        // const map = new google.maps.Map(mapRef.current!, {
        //   center: { lat: data.location.lat, lng: data.location.lng },
        //   zoom: 10,
        // });
        setCenterLatitude(data.location.lat);
        setCenterLongitude(data.location.lng);

        getVenuesByGeoLazyQuery({
          fetchPolicy: 'network-only',
          variables: {
            distance: milesToMeters(DISTANCE_TO_COURTS),
            from: {
              type: 'Point',
              coordinates: [data.location.lng, data.location.lat],
            },
          },
        });

        return fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.location.lat},${data.location.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.results && data.results.length > 0) {
              const addressParts = extractAddressParts(data.results[0]);
              setAddressString(
                `${addressParts.city}, ${addressParts.state} ${addressParts.zipcode}`,
              );
            }
          });
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  React.useEffect(() => {
    requestUserLocation()
      .then(() => {
        if (navigator.geolocation) {
          return navigator.geolocation.getCurrentPosition((position) => {
            getVenuesByGeoLazyQuery({
              fetchPolicy: 'network-only',
              variables: {
                distance: milesToMeters(DISTANCE_TO_COURTS),
                from: {
                  type: 'Point',
                  coordinates: [position.coords.longitude, position.coords.latitude],
                },
              },
            });
            setCenterLatitude(position.coords.latitude);
            setCenterLongitude(position.coords.longitude);
            setIsExactCenter(true);
          });
        }
      })
      .catch((error) => {});
  }, []);

  const venues = React.useMemo(() => {
    if (!data?.venues || data.venues.length === 0) {
      return [];
    }

    return data.venues
      .map((venue) => {
        return {
          ...venue,
          distance: calculateHaversineDistance({
            coord1: {
              latitude: exactAddress?.geometry?.location?.lat() || 0,
              longitude: exactAddress?.geometry?.location?.lng() || 0,
            },
            coord2: {
              latitude: venue.geometry.coordinates[1],
              longitude: venue.geometry.coordinates[0],
            },
            unit: 'miles',
          }),
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [data?.venues, exactAddress]);

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

  const getImmediateAutcompletePlaces = async (
    input: string,
  ): Promise<google.maps.places.AutocompletePrediction[]> => {
    return new Promise((resolve) => {
      const options = {};

      console.log('--- GETTING ADDRESS = ', input);

      const autocompleteService = new window.google.maps.places.AutocompleteService();
      console.log({ autocompleteService });
      autocompleteService.getPlacePredictions({ input, ...options }, (predictions, status) => {
        console.log({ predictions, status });
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          captureException(new Error('Google Maps Error:' + ' ' + status));
          return;
        }

        setSuggestedAddresses(predictions || []);
        resolve(predictions || []);
      });
    });
  };

  const getAutocompletePlaces = debounce(getImmediateAutcompletePlaces, 1000);

  const handleSubmit = async (address?: google.maps.places.AutocompletePrediction | null) => {
    console.log('--- SUBMIT = ', address);
    try {
      // setMapsRequestStatus(RequestStatus.Loading);

      let addressForFetch = address;

      if (!address) {
        const finalAddress = await getImmediateAutcompletePlaces(addressString);
        addressForFetch = finalAddress[0];
        setActiveAddress(addressForFetch);
      }

      const exactAddressResp = await getExactDetails(addressForFetch?.place_id || '');

      console.log('--- EXACT ADDRESS = ', exactAddressResp);

      if (!exactAddressResp || !exactAddressResp.geometry || !exactAddressResp.geometry.location) {
        return;
      }

      setExactAddress(exactAddressResp);

      const fields = extractAddressParts(exactAddressResp);

      setCenterLatitude(exactAddressResp.geometry.location.lat());
      setCenterLongitude(exactAddressResp.geometry.location.lng());
      setIsExactCenter(true);

      setMapsRequestStatus(RequestStatus.Idle);

      getVenuesByGeoLazyQuery({
        fetchPolicy: 'network-only',
        variables: {
          distance: milesToMeters(DISTANCE_TO_COURTS),
          from: {
            type: 'Point',
            coordinates: [
              exactAddressResp.geometry.location.lng(),
              exactAddressResp.geometry.location.lat(),
            ],
          },
        },
      });
    } catch (error) {
      captureException(error);
    }
  };

  console.log('--- VENUES = ', venues);
  console.log(centerLatitude, centerLongitude);

  return {
    isDisabled,
    setAddressString,
    setActiveAddress,
    getAutocompletePlaces,
    setSuggestedAddresses,
    addressString,
    suggestedAddresses,
    activeAddress,
    handleSubmit,
    venues,

  }
};
