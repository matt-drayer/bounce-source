import * as React from 'react';

export default function Lock({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 16 16'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.00039 7.19961V5.59961C4.00039 3.39047 5.79124 1.59961 8.00038 1.59961C10.2095 1.59961 12.0004 3.39047 12.0004 5.59961V7.19961C12.884 7.19961 13.6004 7.91595 13.6004 8.79961V12.7996C13.6004 13.6833 12.884 14.3996 12.0004 14.3996H4.00039C3.11673 14.3996 2.40039 13.6833 2.40039 12.7996V8.79961C2.40039 7.91595 3.11673 7.19961 4.00039 7.19961ZM10.4004 5.59961V7.19961H5.60038V5.59961C5.60038 4.27413 6.6749 3.19961 8.00038 3.19961C9.32586 3.19961 10.4004 4.27413 10.4004 5.59961Z"
        fill="currentColor"
      />
    </svg>
  );
}
