import * as React from 'react';

export default function Towel({ className, viewBox = '0 0 16 16' }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.5 2L11.5 2C12.0523 2 12.5 2.44772 12.5 3V10H5.5V3C5.5 2.5 5 2 4.5 2Z"
        fill="currentColor"
      />
      <path
        d="M3 3.25C3 2.83579 3.33579 2.5 3.75 2.5C4.16421 2.5 4.5 2.83579 4.5 3.25V12H3.5C3.22386 12 3 11.7761 3 11.5V3.25Z"
        fill="currentColor"
      />
      <rect x="5.5" y="11" width="7" height="1" fill="currentColor" />
      <path
        d="M5.5 13H12.5V13.5C12.5 13.7761 12.2761 14 12 14H6C5.72386 14 5.5 13.7761 5.5 13.5V13Z"
        fill="currentColor"
      />
    </svg>
  );
}
