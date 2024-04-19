import * as React from 'react';

export default function Cafe({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.667 2.5H5.00033C4.08366 2.5 3.33366 3.25 3.33366 4.16667V10.8333C3.33366 12.675 4.82533 14.1667 6.66699 14.1667H11.667C13.5087 14.1667 15.0003 12.675 15.0003 10.8333V8.33333H16.667C17.5837 8.33333 18.3337 7.58333 18.3337 6.66667V4.16667C18.3337 3.25 17.5837 2.5 16.667 2.5ZM16.667 6.66667H15.0003V4.16667H16.667V6.66667ZM2.50033 17.5H15.8337C16.292 17.5 16.667 17.125 16.667 16.6667C16.667 16.2083 16.292 15.8333 15.8337 15.8333H2.50033C2.04199 15.8333 1.66699 16.2083 1.66699 16.6667C1.66699 17.125 2.04199 17.5 2.50033 17.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
