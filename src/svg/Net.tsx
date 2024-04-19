import * as React from 'react';

export default function Net({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8.94737H5.94737V6H4.47368C3.66316 6 3 6.66316 3 7.47368V8.94737ZM3 12.6316H5.94737V9.68421H3V12.6316ZM6.68421 12.6316H9.63158V9.68421H6.68421V12.6316ZM10.3684 12.6316H13.3158V9.68421H10.3684V12.6316ZM6.68421 8.94737H9.63158V6H6.68421V8.94737ZM10.3684 6V8.94737H13.3158V6H10.3684ZM14.0526 12.6316H17V9.68421H14.0526V12.6316ZM5.94737 16.3158V13.3684H3V16.3158H5.94737ZM6.68421 16.3158H9.63158V13.3684H6.68421V16.3158ZM10.3684 16.3158H13.3158V13.3684H10.3684V16.3158ZM14.0526 16.3158H17V13.3684H14.0526V16.3158ZM14.0526 6V8.94737H17V7.47368C17 6.66316 16.3368 6 15.5263 6H14.0526Z"
        fill="currentColor"
      />
      <path
        d="M1 6.5C1 5.11929 2.11929 4 3.5 4H16.5C17.8807 4 19 5.11929 19 6.5V16C19 16.2761 18.7761 16.5 18.5 16.5C18.2239 16.5 18 16.2761 18 16V7C18 5.89543 17.1046 5 16 5H4C2.89543 5 2 5.89543 2 7V16C2 16.2761 1.77614 16.5 1.5 16.5C1.22386 16.5 1 16.2761 1 16V6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}