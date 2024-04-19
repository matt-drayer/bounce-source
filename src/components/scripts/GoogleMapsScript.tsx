import Script from 'next/script';

export default function GoogleMapsScript() {
  return (
    <Script
      id="google-maps"
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="beforeInteractive"
    />
  );
}
