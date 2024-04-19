import * as React from 'react';

export default function ArrowRight({
  className: className,
  viewBox = '0 0 14 9',
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox={viewBox} fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.83392 0.734315C9.14634 0.421895 9.65288 0.421895 9.96529 0.734315L13.1653 3.93431C13.4777 4.24673 13.4777 4.75327 13.1653 5.06569L9.96529 8.26569C9.65288 8.5781 9.14634 8.5781 8.83392 8.26569C8.5215 7.95327 8.5215 7.44673 8.83392 7.13432L10.6682 5.3H1.39961C0.957782 5.3 0.599609 4.94183 0.599609 4.5C0.599609 4.05817 0.957782 3.7 1.39961 3.7H10.6682L8.83392 1.86569C8.5215 1.55327 8.5215 1.04673 8.83392 0.734315Z"
        fill="currentColor"
      />
    </svg>
  );
}
