import * as React from 'react';

export default function Outdoor({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 9H11V13H10V9Z" fill="currentColor" />
      <path
        d="M14 5.5C14 7.98528 12.433 10 10.5 10C8.567 10 7 7.98528 7 5.5C7 3.01472 8.567 1 10.5 1C12.433 1 14 3.01472 14 5.5Z"
        fill="currentColor"
      />
      <path
        d="M5 3C5 4.10457 4.10457 5 3 5C1.89543 5 1 4.10457 1 3C1 1.89543 1.89543 1 3 1C4.10457 1 5 1.89543 5 3Z"
        fill="currentColor"
      />
      <path d="M1 14.0001C4 9.99995 12 10 15 14.0002L1 14.0001Z" fill="currentColor" />
    </svg>
  );
}
