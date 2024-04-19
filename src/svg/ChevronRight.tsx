import * as React from 'react';

export default function ChevronRight({
  className,
  viewBox = '0 0 20 21',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29289 15.2071C6.90237 14.8166 6.90237 14.1834 7.29289 13.7929L10.5858 10.5L7.29289 7.20711C6.90237 6.81658 6.90237 6.18342 7.29289 5.79289C7.68342 5.40237 8.31658 5.40237 8.70711 5.79289L12.7071 9.79289C13.0976 10.1834 13.0976 10.8166 12.7071 11.2071L8.70711 15.2071C8.31658 15.5976 7.68342 15.5976 7.29289 15.2071Z"
        fill="currentColor"
      />
    </svg>
  );
}
