import * as React from "react";

export default function Star({
  className,
  viewBox = "0 0 19 18",
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox={viewBox}
      fill="none"
    >
      <path
        d="M9.03834 1.10996C9.20914 0.699318 9.79086 0.699318 9.96166 1.10996L12.0278 6.07744C12.0998 6.25056 12.2626 6.36885 12.4495 6.38383L17.8123 6.81376C18.2556 6.8493 18.4354 7.40256 18.0976 7.69189L14.0117 11.1919C13.8693 11.3139 13.8071 11.5053 13.8506 11.6876L15.0989 16.9208C15.2021 17.3534 14.7315 17.6954 14.3519 17.4635L9.76063 14.6592C9.60062 14.5615 9.39938 14.5615 9.23937 14.6592L4.64806 17.4635C4.26851 17.6954 3.79788 17.3534 3.90108 16.9208L5.14939 11.6876C5.19289 11.5053 5.1307 11.3139 4.98831 11.1919L0.902413 7.69189C0.564645 7.40256 0.744408 6.8493 1.18773 6.81376L6.55054 6.38383C6.73744 6.36885 6.90024 6.25056 6.97225 6.07744L9.03834 1.10996Z"
        fill="currentColor"
      />
    </svg>
  );
}