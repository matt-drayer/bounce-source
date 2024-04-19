// src/context/GeoLocationContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

export interface Position {
  latitude: number;
  longitude: number;
}

interface GeoLocationState {
  position: Position | null;
  setPosition: (position: Position | null) => void;
  addressString: string;
  setAddressString: (address: string) => void;
  // suggestedAddresses: google.maps.places.AutocompletePrediction[];
  // setSuggestedAddresses: (addresses: google.maps.places.AutocompletePrediction[]) => void;
  exactAddress: google.maps.places.PlaceResult | null;
  setExactAddress: (exactAddress: google.maps.places.PlaceResult | null) => void;
  errorRequestLocation: null | Error | PositionErrorCallback | GeolocationPositionError;
  setErrorRequestLocation: (
    error: null | Error | PositionErrorCallback | GeolocationPositionError,
  ) => void;
  isExactCenter: boolean;
  setIsExactCenter: (isExactCenter: boolean) => void;
  centerLatitude: number;
  centerLongitude: number;
  hasSetLocationEstimate: boolean;
  setHasSetLocationEstimate: (hasSetLocationEstimate: boolean) => void;
  hasSetExactLocation: boolean;
  setHasSetExactLocation: (hasSetExactLocation: boolean) => void;
}

const GeoLocationContext = createContext<GeoLocationState | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const GeoLocationProvider = ({ children }: Props) => {
  const [hasSetLocationEstimate, setHasSetLocationEstimate] = useState(false);
  const [hasSetExactLocation, setHasSetExactLocation] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [addressString, setAddressString] = useState<string>('');
  // const [suggestedAddresses, setSuggestedAddresses] = useState<
  //   google.maps.places.AutocompletePrediction[]
  // >([]);
  const [exactAddress, setExactAddress] = useState<google.maps.places.PlaceResult | null>(null);
  const [isExactCenter, setIsExactCenter] = useState(false);
  const [errorRequestLocation, setErrorRequestLocation] = useState<
    null | Error | PositionErrorCallback | GeolocationPositionError
  >(null);

  const value: GeoLocationState = {
    position,
    centerLatitude: position?.latitude || 0,
    centerLongitude: position?.longitude || 0,
    setPosition,
    addressString,
    setAddressString,
    exactAddress,
    setExactAddress,
    isExactCenter,
    setIsExactCenter,
    errorRequestLocation,
    setErrorRequestLocation,
    hasSetLocationEstimate,
    setHasSetLocationEstimate,
    hasSetExactLocation,
    setHasSetExactLocation,
  };

  return <GeoLocationContext.Provider value={value}>{children}</GeoLocationContext.Provider>;
};

export const useGeoLocationState = () => {
  const context = useContext(GeoLocationContext);
  if (context === undefined) {
    throw new Error('useGeoLocationState must be used within a GeoLocationProvider');
  }
  return context;
};
