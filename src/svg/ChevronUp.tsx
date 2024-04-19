import * as React from 'react';

export default function ChevronUp({
  className,
  viewBox = '0 0 24 24',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={viewBox}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
    </svg>
  );
}
