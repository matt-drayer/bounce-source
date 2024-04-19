import * as React from 'react';

export default function CalendarPlus({
  className,
  viewBox = '0 0 17 16',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5001 2.39961C4.5001 1.95778 4.85827 1.59961 5.3001 1.59961C5.74193 1.59961 6.1001 1.95778 6.1001 2.39961V3.19961H10.9001V2.39961C10.9001 1.95778 11.2583 1.59961 11.7001 1.59961C12.1419 1.59961 12.5001 1.95778 12.5001 2.39961V3.19961H13.3001C14.1838 3.19961 14.9001 3.91595 14.9001 4.79961V12.7996C14.9001 13.6833 14.1838 14.3996 13.3001 14.3996H3.7001C2.81644 14.3996 2.1001 13.6833 2.1001 12.7996V4.79961C2.1001 3.91595 2.81644 3.19961 3.7001 3.19961H4.5001V2.39961ZM9.3001 6.39961C9.3001 5.95778 8.94193 5.59961 8.5001 5.59961C8.05827 5.59961 7.7001 5.95778 7.7001 6.39961V7.99961H6.1001C5.65827 7.99961 5.3001 8.35778 5.3001 8.79961C5.3001 9.24144 5.65827 9.59961 6.1001 9.59961H7.7001V11.1996C7.7001 11.6414 8.05827 11.9996 8.5001 11.9996C8.94193 11.9996 9.3001 11.6414 9.3001 11.1996V9.59961H10.9001C11.3419 9.59961 11.7001 9.24144 11.7001 8.79961C11.7001 8.35778 11.3419 7.99961 10.9001 7.99961H9.3001V6.39961Z"
        fill="currentColor"
      />
    </svg>
  );
}