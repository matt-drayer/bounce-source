import * as React from 'react';

interface Props {
  className?: string;
}

const Court: React.FC<Props> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.81937 12H12.1859L12.5 14H3.5L3.81937 12Z" fill="currentColor" />
      <path d="M5.375 2H10.5859L11 4H5L5.375 2Z" fill="currentColor" />
      <path d="M4.5 7.5H7.74781L7.74784 11H4L4.5 7.5Z" fill="currentColor" />
      <path d="M11.5664 7.5H8.25216V11H12L11.5664 7.5Z" fill="currentColor" />
      <path d="M4.5 7L7.74779 7.00009V4.34839H5L4.5 7Z" fill="currentColor" />
      <path d="M11.5 7L8.25221 7.00009V4.34839L11.0586 4.34845L11.5 7Z" fill="currentColor" />
      <path
        d="M5 2L2.5 14L2.28078 14C1.63021 14 1.15285 13.3886 1.31063 12.7575L3.90532 2.37873C3.96096 2.15615 4.16095 2 4.39039 2L5 2Z"
        fill="#9CA3AF"
      />
      <path
        d="M11 2L13.5 14L13.7192 14C14.3698 14 14.8472 13.3886 14.6894 12.7575L12.0947 2.37873C12.039 2.15615 11.839 2 11.6096 2L11 2Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

export default Court;
