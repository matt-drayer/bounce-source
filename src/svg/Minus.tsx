import * as React from 'react';

export default function Minus({ className, viewBox = '0 0 21 21' }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.49988 10.0674C3.49988 9.80217 3.60523 9.54781 3.79277 9.36028C3.98031 9.17274 4.23466 9.06738 4.49988 9.06738H16.4999C16.7651 9.06738 17.0194 9.17274 17.207 9.36028C17.3945 9.54781 17.4999 9.80217 17.4999 10.0674C17.4999 10.3326 17.3945 10.587 17.207 10.7745C17.0194 10.962 16.7651 11.0674 16.4999 11.0674H4.49988C4.23466 11.0674 3.98031 10.962 3.79277 10.7745C3.60523 10.587 3.49988 10.3326 3.49988 10.0674Z"
        fill="currentColor"
      />
    </svg>
  );
}
