import * as React from 'react';

export default function Water({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.35791 1.66797C3.36624 1.66797 2.59124 2.53464 2.69958 3.51797L4.17458 16.8596C4.27458 17.693 4.97458 18.3346 5.83291 18.3346H14.1662C15.0246 18.3346 15.7246 17.693 15.8246 16.8596L17.2996 3.51797C17.4079 2.53464 16.6329 1.66797 15.6412 1.66797H4.35791ZM9.99958 15.8346C8.61624 15.8346 7.49958 14.718 7.49958 13.3346C7.49958 12.043 9.00791 10.043 9.68291 9.21797C9.84958 9.00964 10.1579 9.00964 10.3246 9.21797C10.9996 10.0513 12.5079 12.043 12.5079 13.3346C12.4996 14.718 11.3829 15.8346 9.99958 15.8346ZM15.2746 6.66797H4.72458L4.45791 4.25964C4.40791 3.76797 4.79124 3.33464 5.29124 3.33464H14.7079C15.1996 3.33464 15.5912 3.76797 15.5329 4.25964L15.2746 6.66797Z"
        fill="currentColor"
      />
    </svg>
  );
}