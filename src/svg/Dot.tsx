import * as React from 'react';

export default function Dot({
  className,
  viewBox = '0 0 4 4',
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
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </svg>
  );
}
