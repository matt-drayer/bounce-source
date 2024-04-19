import React, { ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export interface Props extends NextLinkProps {
  href: string; // | NextLinkProps['href'];
  isExternal?: boolean;
  isShallow?: boolean;
  children?: ReactNode;
  target?: HTMLAnchorElement['target'];
  className?: string;
}

export default function Link({
  isExternal = false,
  isShallow = false,
  href,
  className,
  children,
  ...rest
}: Props) {
  return isExternal ? (
    <a href={href} className={className} target="_blank" {...rest} rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <NextLink shallow={isShallow} href={href} {...rest} className={className}>
      {children}
    </NextLink>
  );
}
