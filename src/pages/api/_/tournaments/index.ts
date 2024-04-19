import type { NextApiRequest, NextApiResponse } from 'next';
import { getEventUrl } from 'constants/pages';
import { getTournamentsForMarketplace } from 'services/server/graphql/queries/getTournamentsForMarketplace';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';

const DISTANCE_TO_TOURNAMENTS_MILES = 10;
const MAX_TOURNAMENTS = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers['authorization'];

  if (!authHeader?.includes(process.env.PICKLEBALLGPT_API_KEY || '')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { location } = req.query;

  console.log(location);

  if (!location || typeof location !== 'string') {
    return res.status(400).json({ message: 'Bad Request: Location is required' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location,
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data.status !== 'OK') {
      return res.status(500).json({ message: 'Error from Google Maps API', details: data.status });
    }

    const { lat, lng }: { lat: number; lng: number } = data.results[0].geometry.location;

    const tournamentsResponse = await getTournamentsForMarketplace();

    if (!tournamentsResponse?.events || tournamentsResponse.events.length === 0) {
      return res.status(404).json({ message: 'No venues found' });
    }

    const tournamentsWithDistance = tournamentsResponse.events
      .map((tournament) => {
        const distance = calculateHaversineDistance({
          coord1: { latitude: lat, longitude: lng },
          coord2: { latitude: tournament.latitude, longitude: tournament.longitude },
          unit: 'miles',
        });

        return {
          /**
           * @todo update this to internal URL
           */
          url: `${process.env.APP_URL}${getEventUrl(tournament.id)}`,
          distance,
          ...tournament,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_TOURNAMENTS);

    console.log(tournamentsResponse.events.length);

    return res.status(200).json({
      tournaments: tournamentsWithDistance,
      tournamentCount: tournamentsWithDistance.length,
      radiusMiles: DISTANCE_TO_TOURNAMENTS_MILES,
      centerLatitude: lat,
      centerLongitude: lng,
    });
  } catch (error) {
    console.error('Error in Geocoding API call:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
