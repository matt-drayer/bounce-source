import * as React from 'react';

export default function EraseIcon({
  className,
  viewBox = '0 0 16 16',
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" className={className}>
      <mask
        id="mask0_11152_38425"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="1"
        width="16"
        height="13"
      >
        <mask
          id="mask1_11152_38425"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="16"
          height="16"
        >
          <path d="M0.799805 0.800781H15.1998V15.2008H0.799805V0.800781Z" fill="white" />
        </mask>
        <g mask="url(#mask1_11152_38425)">
          <path
            d="M14.2346 8.05069L10.3754 2.92969L5.04053 6.94969L9.05003 11.8997L10.0568 11.1989L14.2346 8.05069Z"
            fill="white"
            stroke="white"
            strokeWidth="2.151"
            strokeLinejoin="round"
          />
          <path
            d="M9.05003 11.8997L7.89833 12.8222L4.72943 12.8219L3.94943 11.7869L2.01953 9.22609L5.15003 6.86719"
            stroke="white"
            strokeWidth="2.151"
            strokeLinejoin="round"
          />
          <path
            d="M4.76172 12.8203H14.1697"
            stroke="white"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </g>
      </mask>
      <g mask="url(#mask0_11152_38425)">
        <path d="M0.799805 0.800781H15.1998V15.2008H0.799805V0.800781Z" fill="currentColor" />
      </g>
    </svg>
  );
}
