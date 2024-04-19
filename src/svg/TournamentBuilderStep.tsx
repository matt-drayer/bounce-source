import * as React from 'react';

export default function TournamentBuilderStep({
  active = false,
  completed = false,
}: {
  active: boolean;
  completed: boolean;
}) {
  if (active) {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_511_1648)">
          <g clipPath="url(#clip0_511_1648)">
            <rect x="4" y="4" width="32" height="32" rx="16" fill="#F7F7F8" />
            <rect x="4" y="4" width="32" height="32" rx="16" fill="#FF5C33" />
            <circle cx="20" cy="20" r="5" fill="white" />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_511_1648"
            x="0"
            y="0"
            width="40"
            height="40"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="4"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_511_1648"
            />
            <feOffset />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.992157 0 0 0 0 0.933333 0 0 0 0 0.886275 0 0 0 1 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_511_1648" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_511_1648"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_511_1648">
            <rect x="4" y="4" width="32" height="32" rx="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (!active && !completed) {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_511_1641)">
          <rect width="32" height="32" rx="16" fill="#F7F7F8" />
          <circle cx="16" cy="16" r="5" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_511_1641">
            <rect width="32" height="32" rx="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_511_1792)">
        <rect width="32" height="32" rx="16" fill="#FF5C33" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.7952 9.85322L13.2485 19.0666L10.7152 16.3599C10.2485 15.9199 9.51519 15.8932 8.98185 16.2666C8.46185 16.6532 8.31519 17.3332 8.63519 17.8799L11.6352 22.7599C11.9285 23.2132 12.4352 23.4932 13.0085 23.4932C13.5552 23.4932 14.0752 23.2132 14.3685 22.7599C14.8485 22.1332 24.0085 11.2132 24.0085 11.2132C25.2085 9.98655 23.7552 8.90655 22.7952 9.83989V9.85322Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_511_1792">
          <rect width="32" height="32" rx="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
