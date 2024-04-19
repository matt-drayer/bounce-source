import * as React from "react";

export default function Line({
  className,
  viewBox = "0 0 8 1",
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.853516"
        y1="0.5"
        x2="7.14709"
        y2="0.500001"
        stroke="currentColor"
      />
    </svg>
  );
}
