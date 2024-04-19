export default function BounceLogoSplash({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox={viewBox || '0 0 96 180'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="48" cy="132" r="48" fill="url(#paint0_radial_8297_609969)" />
      <circle cx="48" cy="108" r="48" fill="url(#paint1_radial_8297_609969)" />
      <path
        d="M0.0138788 21L0 84.3666C0.196948 110.708 21.6125 132 47.9999 132C74.5096 132 95.9999 110.51 95.9999 84.0001C95.9999 57.4905 74.5096 36.0001 47.9999 36.0001C45.8479 36.0001 44.0632 36.1418 41.9861 36.4162L42 21C42 8.3031 31.56 -9.15528e-07 21 0C10.44 9.15528e-07 0.0138788 8.3031 0.0138788 21Z"
        fill="url(#paint2_radial_8297_609969)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_8297_609969"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(48 156.48) rotate(-90) scale(70.5172)"
        >
          <stop stopColor="#ED4F2F" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FF512E" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_8297_609969"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(48 132.48) rotate(-90) scale(70.5172)"
        >
          <stop stopColor="#ED4F2F" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FF512E" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_8297_609969"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(68.2295 63.4572) rotate(131.479) scale(75.6541 76.3231)"
        >
          <stop stopColor="#FF8134" />
          <stop offset="0.575862" stopColor="#FF5E25" />
          <stop offset="0.995756" stopColor="#ED4F2F" />
        </radialGradient>
      </defs>
    </svg>
  );
}
