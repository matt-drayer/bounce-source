import * as React from 'react';

export default function Mail({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.003 5.884L10 9.882L17.997 5.884C17.9674 5.37444 17.7441 4.89549 17.3728 4.54523C17.0016 4.19497 16.5104 3.99991 16 4H4C3.48958 3.99991 2.99845 4.19497 2.62718 4.54523C2.25591 4.89549 2.0326 5.37444 2.003 5.884Z"
        fill="currentColor"
      />
      <path
        d="M18 8.118L10 12.118L2 8.118V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H16C16.5304 16 17.0391 15.7893 17.4142 15.4142C17.7893 15.0391 18 14.5304 18 14V8.118Z"
        fill="currentColor"
      />
    </svg>
  );
}
