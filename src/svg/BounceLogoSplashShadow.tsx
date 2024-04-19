export default function BounceLogoSplash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox={props.viewBox || '0 0 120 121'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        opacity="0.7"
        cx="60"
        cy="111.524"
        rx="60"
        ry="8.5237"
        fill="url(#paint0_radial_12073_54137)"
      />
      <ellipse
        cx="60.6667"
        cy="73.3346"
        rx="26.6667"
        ry="26.6667"
        fill="url(#paint1_radial_12073_54137)"
      />
      <ellipse
        cx="60.6667"
        cy="59.9987"
        rx="26.6667"
        ry="26.6667"
        fill="url(#paint2_radial_12073_54137)"
      />
      <path
        d="M34.0077 11.6667L34 46.8703C34.1094 61.5042 46.007 73.3333 60.6666 73.3333C75.3942 73.3333 87.3332 61.3943 87.3332 46.6667C87.3332 31.9392 75.3942 20.0001 60.6666 20.0001C59.471 20.0001 58.4795 20.0788 57.3256 20.2312L57.3333 11.6667C57.3333 4.61283 51.5333 -5.08627e-07 45.6667 0C39.8 5.08627e-07 34.0077 4.61283 34.0077 11.6667Z"
        fill="#FF5C33"
      />
      <defs>
        <radialGradient
          id="paint0_radial_12073_54137"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 111.524) rotate(90) scale(8.5237 60)"
        >
          <stop stopColor="#D1D1D1" stop-opacity="0.74" />
          <stop offset="0.838555" stopColor="#DBDBDB" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_12073_54137"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60.6667 86.9346) rotate(-90) scale(39.1762 39.1762)"
        >
          <stop stopColor="#FF5C33" stop-opacity="0.4" />
          <stop offset="1" stopColor="#FF5C33" stop-opacity="0.1" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_12073_54137"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60.6667 73.5987) rotate(-90) scale(39.1762 39.1762)"
        >
          <stop stopColor="#FF5C33" stop-opacity="0.7" />
          <stop offset="1" stopColor="#FF5C33" stop-opacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
