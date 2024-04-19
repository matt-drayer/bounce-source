import * as React from 'react';

export default function Edit({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 16 16'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.9315 2.06824C13.3066 1.4434 12.2936 1.4434 11.6687 2.06824L5.6001 8.13687V10.3996H7.86283L13.9315 4.33098C14.5563 3.70614 14.5563 2.69308 13.9315 2.06824Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.6001 4.79961C1.6001 3.91595 2.31644 3.19961 3.2001 3.19961H6.4001C6.84192 3.19961 7.2001 3.55778 7.2001 3.99961C7.2001 4.44144 6.84192 4.79961 6.4001 4.79961H3.2001V12.7996H11.2001V9.59961C11.2001 9.15778 11.5583 8.79961 12.0001 8.79961C12.4419 8.79961 12.8001 9.15778 12.8001 9.59961V12.7996C12.8001 13.6833 12.0837 14.3996 11.2001 14.3996H3.2001C2.31644 14.3996 1.6001 13.6833 1.6001 12.7996V4.79961Z"
        fill="currentColor"
      />
    </svg>
  );
}
