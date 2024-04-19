import * as React from 'react';

export default function SuccessIcon({
  className,
  viewBox = '0 0 120 120',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        opacity="0.7"
        cx="60"
        cy="111.408"
        rx="60"
        ry="8.5919"
        fill="url(#paint0_radial_8982_651183)"
      />
      <circle cx="60" cy="66.248" r="35" fill="url(#paint1_radial_8982_651183)" />
      <circle cx="60" cy="50.1191" r="35" fill="url(#paint2_radial_8982_651183)" />
      <ellipse cx="60.7604" cy="33.9707" rx="20.1879" ry="20.664" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60 70C79.33 70 95 54.33 95 35C95 15.67 79.33 0 60 0C40.67 0 25 15.67 25 35C25 54.33 40.67 70 60 70ZM76.2186 29.3436C77.9271 27.635 77.9271 24.865 76.2186 23.1564C74.51 21.4479 71.74 21.4479 70.0314 23.1564L55.625 37.5628L49.9686 31.9064C48.26 30.1979 45.49 30.1979 43.7814 31.9064C42.0729 33.615 42.0729 36.385 43.7814 38.0936L52.5314 46.8436C54.24 48.5521 57.01 48.5521 58.7186 46.8436L76.2186 29.3436Z"
        fill="#DF4320"
      />
      <defs>
        <radialGradient
          id="paint0_radial_8982_651183"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 111.408) rotate(90) scale(8.5919 60)"
        >
          <stop stopColor="#CDCDCD" stop-opacity="0.74" />
          <stop offset="0.838555" stopColor="#DBDBDB" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_8982_651183"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 84.098) rotate(-90) scale(51.4188)"
        >
          <stop stopColor="#ED4F2F" stop-opacity="0.4" />
          <stop offset="1" stopColor="#FF512E" stop-opacity="0.1" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_8982_651183"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 67.9691) rotate(-90) scale(51.4188)"
        >
          <stop stopColor="#ED4F2F" stop-opacity="0.7" />
          <stop offset="1" stopColor="#FF512E" stop-opacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
