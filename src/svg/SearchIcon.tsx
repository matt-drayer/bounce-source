import * as React from 'react';

const SearchIcon = ({ className, viewBox }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99935 12.9167C7.46804 12.9167 5.41602 10.8647 5.41602 8.33341C5.41602 5.80211 7.46804 3.75008 9.99935 3.75008C12.5307 3.75008 14.5827 5.80211 14.5827 8.33341C14.5827 10.8647 12.5307 12.9167 9.99935 12.9167ZM9.99935 15.0001C6.31745 15.0001 3.33268 12.0153 3.33268 8.33341C3.33268 4.65152 6.31745 1.66675 9.99935 1.66675C13.6812 1.66675 16.666 4.65152 16.666 8.33341C16.666 12.0153 13.6812 15.0001 9.99935 15.0001Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.39796 12.7878C6.8001 12.4427 6.03561 12.6475 5.69043 13.2454L4.14534 15.9215C3.80017 16.5194 4.00501 17.2839 4.60288 17.6291C5.20074 17.9742 5.96523 17.7694 6.31041 17.1715L7.85549 14.4954C8.20067 13.8975 7.99583 13.133 7.39796 12.7878Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SearchIcon;
