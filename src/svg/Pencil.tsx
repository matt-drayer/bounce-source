import * as React from 'react';

export default function Pencil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox={props.viewBox || '0 0 16 16'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8685 2.86853C11.4934 2.24369 12.5064 2.24369 13.1313 2.86853C13.7561 3.49337 13.7561 4.50643 13.1313 5.13127L12.4969 5.76559L10.2342 3.50285L10.8685 2.86853Z"
        fill="currentColor"
      />
      <path
        d="M9.10284 4.63422L2.3999 11.3372V13.5999H4.66264L11.3656 6.89696L9.10284 4.63422Z"
        fill="currentColor"
      />
    </svg>
  );
}
