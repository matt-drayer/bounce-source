export default function ChatBubble({ className, viewBox }: React.SVGProps<SVGSVGElement>) {
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
        d="M14.4 8.00039C14.4 11.0932 11.5346 13.6004 7.99998 13.6004C6.80667 13.6004 5.68964 13.3146 4.73339 12.817L1.59998 13.6004L2.67062 11.1022C1.99422 10.2142 1.59998 9.1476 1.59998 8.00039C1.59998 4.9076 4.46535 2.40039 7.99998 2.40039C11.5346 2.40039 14.4 4.9076 14.4 8.00039ZM5.59998 7.20039H3.99998V8.80039H5.59998V7.20039ZM12 7.20039H10.4V8.80039H12V7.20039ZM7.19998 7.20039H8.79998V8.80039H7.19998V7.20039Z"
        fill="currentColor"
      />
    </svg>
  );
}
