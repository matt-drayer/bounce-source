import * as React from 'react';

export default function CheckIcon({
  className,
  viewBox = '0 0 32 32',
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="currentColor"
      className={className}
    >
      <g clip-path="url(#clip0_106_3924)">
        <rect width="32" height="32" rx="16" fill="#FF5C33" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8486 22.1334 24.0086 11.2134 24.0086 11.2134C25.2086 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_106_3924">
          <rect width="32" height="32" rx="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
