import * as React from 'react';

export default function User({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 16 16'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99989 7.20039C9.32537 7.20039 10.3999 6.12587 10.3999 4.80039C10.3999 3.47491 9.32537 2.40039 7.99989 2.40039C6.67441 2.40039 5.5999 3.47491 5.5999 4.80039C5.5999 6.12587 6.67441 7.20039 7.99989 7.20039Z"
        fill="currentColor"
      />
      <path
        d="M2.3999 14.4004C2.3999 11.3076 4.9071 8.80039 7.99989 8.80039C11.0927 8.80039 13.5999 11.3076 13.5999 14.4004H2.3999Z"
        fill="currentColor"
      />
    </svg>
  );
}
