import * as React from 'react';

export default function Dashboard({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M13.1759 18.9672C12.7921 19.2657 12.2484 19.2657 11.8646 18.9672L5.30824 13.8714C4.92445 13.5729 4.39141 13.5729 4.00763 13.8714C3.46393 14.2978 3.46393 15.1187 4.00763 15.5451L11.2143 21.1526C11.9819 21.7496 13.0586 21.7496 13.8368 21.1526L21.0435 15.5451C21.5872 15.1187 21.5872 14.2978 21.0435 13.8714L21.0328 13.8607C20.649 13.5622 20.116 13.5622 19.7322 13.8607L13.1759 18.9672ZM13.8475 15.7476L21.0542 10.1401C21.5979 9.71366 21.5979 8.88212 21.0542 8.45569L13.8475 2.84814C13.0799 2.25114 12.0032 2.25114 11.225 2.84814L4.01829 8.46635C3.47459 8.89278 3.47459 9.72432 4.01829 10.1508L11.225 15.7583C11.9925 16.3553 13.0799 16.3553 13.8475 15.7476Z" />
    </svg>
  );
}