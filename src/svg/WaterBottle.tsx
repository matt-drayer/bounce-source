import * as React from 'react';

export default function WaterBottle({
  className,
  viewBox = '0 0 16 16',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2270_29187)">
        <path
          d="M4.30455 4.41277L7.47663 2.93361C9.64428 4.13963 10.4489 4.78561 8.7709 5.70918C10.1718 4.57319 11.4661 7.34876 9.69538 7.69172C10.4182 7.44036 10.8185 7.31734 11.2547 7.93006L13.0508 11.7819C13.2842 12.2824 13.0677 12.8774 12.5671 13.1108L8.82862 14.8541C8.32808 15.0875 7.7331 14.8709 7.49969 14.3704L5.70356 10.5186C5.60882 9.97398 5.6725 9.67359 6.5233 9.17089C5.12193 10.3071 3.82777 7.53147 5.59882 7.18834C3.61787 7.82373 3.79251 6.68383 4.30455 4.41277Z"
          fill="currentColor"
        />
        <rect
          x="3.19482"
          y="2.03387"
          width="3.5"
          height="1.75"
          rx="0.5"
          transform="rotate(-25 3.19482 2.03387)"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2270_29187">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
