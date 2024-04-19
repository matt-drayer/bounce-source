import type { AriaAttributes, ButtonHTMLAttributes } from 'react';
import { Props as InternalLinkProps } from 'components/Link/Link';

export interface ComponentProps {
  children?: React.ReactNode;
  label?: AriaAttributes['aria-labelledby'];
  name?: HTMLButtonElement['name'];
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isInline?: boolean;
  isInlineMobile?: boolean;
  isInlineDesktop?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  sizeMobile?: 'xs' | 'sm' | 'md' | 'lg';
  sizeDesktop?: 'xs' | 'sm' | 'md' | 'lg';
  variant: 'brand' | 'brand-secondary' | 'primary' | 'secondary' | 'inverted';
}

export interface ButtonProps extends ComponentProps, ButtonHTMLAttributes<HTMLButtonElement> {}

export interface LinkProps extends ComponentProps, InternalLinkProps {
  className?: string;
}

export interface TextComponentProps
  extends Pick<ComponentProps, 'children' | 'size' | 'sizeMobile' | 'sizeDesktop'> {}

export interface ButtonTextProps
  extends TextComponentProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export interface ButtonLinkTextProps extends TextComponentProps, InternalLinkProps {}
