import type { NextApiRequest, NextApiResponse } from 'next';
import { getCourtPageUrl } from 'constants/pages';
import { getVenuesByGeo } from 'services/server/graphql/queries/getVenuesByGeo';

const DISTANCE_TO_COURTS = 10;

function milesToMeters(miles: number): number {
  return miles * 1609.34;
}

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

    const { lat, lng } = data.results[0].geometry.location;

    const venuesResponse = await getVenuesByGeo({
      distance: milesToMeters(DISTANCE_TO_COURTS),
      from: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    });

    if (!venuesResponse?.venues || venuesResponse.venues.length === 0) {
      return res.status(404).json({ message: 'No venues found' });
    }

    console.log(venuesResponse.venues.length);

    return res.status(200).json({
      venueCount: venuesResponse.venues.length,
      venues: venuesResponse.venues.map((venue) => ({
        url: `${process.env.APP_URL}${getCourtPageUrl(venue.slug)}`,
        ...venue,
      })),
      radiusMiles: DISTANCE_TO_COURTS,
      centerLatitude: lat,
      centerLongitude: lng,
    });
  } catch (error) {
    console.error('Error in Geocoding API call:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
