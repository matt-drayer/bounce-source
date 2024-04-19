import * as React from 'react';

export default function Map({
  className,
  viewBox = '0 0 20 20',
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      className={className}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.58594L8 5.58594V18.4144L12 14.4144V1.58594Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.70711 3.29304C3.42111 3.00705 2.99099 2.92149 2.61732 3.07627C2.24364 3.23105 2 3.59569 2 4.00015V14.0002C2 14.2654 2.10536 14.5197 2.29289 14.7073L6 18.4144V5.58594L3.70711 3.29304Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7071 5.29304L14 1.58594V14.4144L16.2929 16.7073C16.5789 16.9933 17.009 17.0788 17.3827 16.924C17.7564 16.7692 18 16.4046 18 16.0002V6.00015C18 5.73493 17.8946 5.48058 17.7071 5.29304Z"
        fill="currentColor"
      />
    </svg>
  );
}
