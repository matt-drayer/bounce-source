import * as React from 'react';

export default function Format({
  className,
  viewBox = '0 0 20 21',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7071 9.79289C18.0976 10.1834 18.0976 10.8166 17.7071 11.2071L10.7071 18.2071C10.3166 18.5976 9.68342 18.5976 9.29289 18.2071L2.29289 11.2071C2.0976 11.0118 1.99997 10.7558 2 10.4999V5.5C2 3.84315 3.34315 2.5 5 2.5H10.0003C10.2561 2.50007 10.5119 2.5977 10.7071 2.79289L17.7071 9.79289ZM5 6.5C5.55228 6.5 6 6.05228 6 5.5C6 4.94772 5.55228 4.5 5 4.5C4.44772 4.5 4 4.94772 4 5.5C4 6.05228 4.44772 6.5 5 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
