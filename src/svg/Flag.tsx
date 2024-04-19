import * as React from 'react';

export default function Flag({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 16 16'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.40039 5.29844C2.40039 3.97295 3.4749 2.89844 4.80038 2.89844H12.8004C13.1034 2.89844 13.3804 3.06964 13.5159 3.34067C13.6514 3.61169 13.6222 3.93602 13.4404 4.17844L11.4004 6.89844L13.4404 9.61844C13.6222 9.86085 13.6514 10.1852 13.5159 10.4562C13.3804 10.7272 13.1034 10.8984 12.8004 10.8984H4.80039C4.35856 10.8984 4.00039 11.2566 4.00039 11.6984V14.0984C4.00039 14.5403 3.64222 14.8984 3.20039 14.8984C2.75856 14.8984 2.40039 14.5403 2.40039 14.0984V5.29844Z"
        fill="currentColor"
      />
    </svg>
  );
}
