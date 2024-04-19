import * as React from 'react';

export default function Photograph({
  className,
  viewBox = '0 0 24 24',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.7999 3.59961C3.47442 3.59961 2.3999 4.67413 2.3999 5.99961V17.9996C2.3999 19.3251 3.47442 20.3996 4.7999 20.3996H19.1999C20.5253 20.3996 21.5999 19.3251 21.5999 17.9996V5.99961C21.5999 4.67413 20.5253 3.59961 19.1999 3.59961H4.7999ZM19.1999 17.9996H4.7999L9.59989 8.39961L13.1999 15.5996L15.5999 10.7996L19.1999 17.9996Z"
        fill="currentColor"
      />
    </svg>
  );
}
