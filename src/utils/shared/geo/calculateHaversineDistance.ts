type Coordinate = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_METERS = 6371e3;
const EARTH_RADIUS_MILES = 3958.8;

const toRadians = (degree: number): number => degree * (Math.PI / 180);

export const calculateHaversineDistance = ({
  coord1,
  coord2,
  unit = 'meters',
}: {
  coord1: Coordinate;
  coord2: Coordinate;
  unit?: 'meters' | 'miles';
}): number => {
  const earthRadius = unit === 'miles' ? EARTH_RADIUS_MILES : EARTH_RADIUS_METERS; // Radius in miles or meters
  const lat1Radians = toRadians(coord1.latitude);
  const lat2Radians = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLng = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Radians) * Math.cos(lat2Radians) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};
