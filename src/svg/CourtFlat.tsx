import * as React from 'react';

export default function CourtFlat({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 11 14'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.0497558 1C0.0497558 0.447716 0.497471 0 1.04976 0H1.24976V14H1.04976C0.497471 14 0.0497558 13.5523 0.0497558 13V1Z"
        fill="currentColor"
      />
      <path
        d="M9.25 0.000304598L9.44973 0.000249677C10.0021 9.77775e-05 10.45 0.447857 10.45 1.00025V13.0002C10.45 13.5524 10.0024 14.0001 9.45026 14.0002L9.25 14.0003V0.000304598Z"
        fill="currentColor"
      />
      <path d="M1.75 0H8.75V2.75H1.75V0Z" fill="currentColor" />
      <path d="M1.75 11.25H8.75V14H1.75V11.25Z" fill="currentColor" />
      <path d="M1.75 3.25H4.99997V6.75H1.75V3.25Z" fill="currentColor" />
      <path d="M1.75 7.25H4.99986V10.75H1.75V7.25Z" fill="currentColor" />
      <path d="M5.5 3.25H8.75V6.75H5.5V3.25Z" fill="currentColor" />
      <path d="M5.5 7.25H8.75V10.75H5.5V7.25Z" fill="currentColor" />
    </svg>
  );
}
