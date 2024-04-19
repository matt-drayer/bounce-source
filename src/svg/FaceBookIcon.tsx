import * as React from 'react';

export default function FaceBookIcon({
  className,
  viewBox = '0 0 22 21',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox={viewBox} fill="none">
      <path
        d="M7.99997 7.5999C8.88362 7.5999 9.59997 6.88356 9.59997 5.9999C9.59997 5.11625 8.88362 4.3999 7.99997 4.3999C7.11632 4.3999 6.39998 5.11625 6.39998 5.9999C6.39998 6.88356 7.11632 7.5999 7.99997 7.5999Z"
        fill="currentColor"
      />
      <path
        d="M21.2003 10.3883C21.2003 4.72058 16.6057 0.125977 10.938 0.125977C5.27022 0.125977 0.675623 4.72058 0.675623 10.3883C0.675623 15.5105 4.42839 19.7561 9.33447 20.526V13.3548H6.7288V10.3883H9.33447V8.12739C9.33447 5.55539 10.8666 4.1347 13.2107 4.1347C14.3331 4.1347 15.5079 4.33514 15.5079 4.33514V6.86063H14.2139C12.9391 6.86063 12.5414 7.65176 12.5414 8.46412V10.3883H15.3876L14.9327 13.3548H12.5414V20.526C17.4475 19.7561 21.2003 15.5105 21.2003 10.3883Z"
        fill="#F7F7F8"
      />
    </svg>
  );
}