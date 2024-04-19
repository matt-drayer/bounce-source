import React from 'react';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';
import type { ButtonLinkTextProps, ButtonProps, ButtonTextProps, LinkProps } from './types';

export function ButtonLink({
  name,
  label,
  iconLeft,
  iconRight,
  isInline,
  isInlineMobile,
  isInlineDesktop,
  variant,
  size,
  sizeMobile,
  sizeDesktop,
  className,
  children,
  href,
  ...rest
}: LinkProps) {
  return (
    <Link
      href={href}
      className={classNames(
        'shrink-0 items-center justify-center rounded-full text-center disabled:cursor-not-allowed disabled:opacity-50',
        isInline || isInlineMobile ? 'inline-flex w-auto' : 'flex w-full',
        isInline || isInlineDesktop ? 'lg:inline-flex lg:w-auto' : 'flex w-full',
        /**
         * @todo: Make different props for mobile and desktop?
         */
        !!sizeMobile && sizeMobile === 'xs' && 'typography-product-button-label-xs px-4 py-1.5',
        !!sizeMobile && sizeMobile === 'sm' && 'typography-product-button-label-small px-4 py-2',
        !!sizeMobile && sizeMobile === 'md' && 'typography-product-button-label-medium px-6 py-2',
        !!sizeMobile && sizeMobile === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!sizeDesktop &&
          sizeDesktop === 'xs' &&
          'typography-product-button-label-xs lg:px-4 lg:py-1.5',
        !!sizeDesktop &&
          sizeDesktop === 'sm' &&
          'typography-product-button-label-small lg:px-4 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'md' &&
          'typography-product-button-label-medium lg:px-6 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'lg' &&
          'typography-product-button-label-large lg:px-8 lg:py-4',
        !!size && size === 'xs' && 'typography-product-button-label-xs px-4 py-1.5',
        !!size && size === 'sm' && 'typography-product-button-label-small px-4 py-2',
        !!size && size === 'md' && 'typography-product-button-label-medium px-6 py-2',
        !!size && size === 'lg' && 'typography-product-button-label-large px-8 py-4',
        variant === 'brand' &&
          'border border-color-brand-primary bg-color-brand-primary text-color-text-darkmode-primary',
        variant === 'brand-secondary' &&
          'border border-color-brand-primary bg-transparent text-color-text-brand',
        variant === 'primary' &&
          'border border-color-button-lightmode bg-color-button-lightmode text-color-text-lightmode-invert dark:border-color-button-darkmode dark:bg-color-button-darkmode dark:text-color-text-darkmode-invert',
        variant === 'secondary' &&
          'border border-color-button-lightmode bg-color-button-darkmode text-color-text-lightmode-primary dark:border-color-button-darkmode dark:bg-color-button-lightmode dark:text-color-text-lightmode-invert',
        variant === 'inverted' &&
          'border border-color-button-lightmode bg-color-button-darkmode text-color-text-lightmode-primary dark:border-color-button-lightmode dark:bg-color-button-lightmode dark:text-color-text-lightmode-invert',
        !!className && className,
      )}
      aria-label={label}
      {...rest}
    >
      {!!iconLeft && (
        <span
          className={classNames(
            (size === 'lg' || size === 'md') && 'mr-2',
            (size === 'xs' || size === 'sm') && 'mr-1',
            (sizeMobile === 'lg' || sizeMobile === 'md') && 'mr-2',
            (sizeMobile === 'xs' || sizeMobile === 'sm') && 'mr-1',
            (sizeDesktop === 'lg' || sizeDesktop === 'md') && 'lg:mr-2',
            (sizeDesktop === 'xs' || sizeDesktop === 'sm') && 'lg:mr-1',
          )}
        >
          {iconLeft}
        </span>
      )}
      <span>{children || label}</span>
      {!!iconRight && (
        <span
          className={classNames(
            (size === 'lg' || size === 'md') && 'ml-2',
            (size === 'xs' || size === 'sm') && 'ml-1',
            (sizeMobile === 'lg' || sizeMobile === 'md') && 'ml-2',
            (sizeMobile === 'xs' || sizeMobile === 'sm') && 'ml-1',
            (sizeDesktop === 'lg' || sizeDesktop === 'md') && 'lg:ml-2',
            (sizeDesktop === 'xs' || sizeDesktop === 'sm') && 'lg:ml-1',
          )}
        >
          {iconRight}
        </span>
      )}
    </Link>
  );
}

export function Button({
  type = 'button',
  name,
  label,
  iconLeft,
  iconRight,
  isInline,
  isInlineMobile,
  isInlineDesktop,
  variant,
  size,
  sizeMobile,
  sizeDesktop,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'items-center justify-center rounded-full text-center disabled:cursor-not-allowed disabled:opacity-50',
        isInline || isInlineMobile ? 'inline-flex w-auto' : 'flex w-full',
        isInline || isInlineDesktop ? 'lg:inline-flex lg:w-auto' : 'flex w-full',
        /**
         * @todo: Make different props for mobile and desktop?
         */
        !!sizeMobile && sizeMobile === 'xs' && 'typography-product-button-label-xs px-4 py-1.5',
        !!sizeMobile && sizeMobile === 'sm' && 'typography-product-button-label-small px-4 py-2',
        !!sizeMobile && sizeMobile === 'md' && 'typography-product-button-label-medium px-6 py-2',
        !!sizeMobile && sizeMobile === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!sizeDesktop &&
          sizeDesktop === 'xs' &&
          'typography-product-button-label-xs lg:px-4 lg:py-1.5',
        !!sizeDesktop &&
          sizeDesktop === 'sm' &&
          'typography-product-button-label-small lg:px-4 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'md' &&
          'typography-product-button-label-medium lg:px-6 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'lg' &&
          'typography-product-button-label-large lg:px-8 lg:py-4',
        !!size && size === 'xs' && 'typography-product-button-label-xs px-4 py-1.5',
        !!size && size === 'sm' && 'typography-product-button-label-small px-4 py-2',
        !!size && size === 'md' && 'typography-product-button-label-medium px-6 py-2',
        !!size && size === 'lg' && 'typography-product-button-label-large min-h-14 px-8 py-4',
        variant === 'brand' &&
          'border border-color-brand-primary bg-color-brand-primary text-color-text-darkmode-primary',
        variant === 'brand-secondary' &&
          'border border-color-brand-primary bg-transparent text-color-text-brand',
        variant === 'primary' &&
          'border border-color-button-lightmode bg-color-button-lightmode text-color-text-lightmode-invert dark:border-color-button-darkmode dark:bg-color-button-darkmode dark:text-color-text-darkmode-invert',
        variant === 'secondary' &&
          'border border-color-button-lightmode bg-color-button-darkmode text-color-text-lightmode-primary dark:border-color-button-darkmode dark:bg-color-button-lightmode dark:text-color-text-lightmode-invert',
        variant === 'inverted' &&
          'border border-color-button-lightmode bg-color-button-darkmode text-color-text-lightmode-primary dark:border-color-button-lightmode dark:bg-color-button-lightmode dark:text-color-text-lightmode-invert',
        !!className && className,
      )}
      name={name || label}
      aria-label={label || type}
      type={type}
      {...rest}
    >
      {!!iconLeft && (
        <span
          className={classNames(
            (size === 'lg' || size === 'md') && 'mr-2',
            (size === 'xs' || size === 'sm') && 'mr-1',
            (sizeMobile === 'lg' || sizeMobile === 'md') && 'mr-2',
            (sizeMobile === 'xs' || sizeMobile === 'sm') && 'mr-1',
            (sizeDesktop === 'lg' || sizeDesktop === 'md') && 'lg:mr-2',
            (sizeDesktop === 'xs' || sizeDesktop === 'sm') && 'lg:mr-1',
          )}
        >
          {iconLeft}
        </span>
      )}
      <span>{children || label}</span>
      {!!iconRight && (
        <span
          className={classNames(
            (size === 'lg' || size === 'md') && 'ml-2',
            (size === 'xs' || size === 'sm') && 'ml-1',
            (sizeMobile === 'lg' || sizeMobile === 'md') && 'ml-2',
            (sizeMobile === 'xs' || sizeMobile === 'sm') && 'ml-1',
            (sizeDesktop === 'lg' || sizeDesktop === 'md') && 'lg:ml-2',
            (sizeDesktop === 'xs' || sizeDesktop === 'sm') && 'lg:ml-1',
          )}
        >
          {iconRight}
        </span>
      )}
    </button>
  );
}

export function ButtonText({
  type = 'button',
  className,
  size,
  sizeMobile,
  sizeDesktop,
  children,
  ...rest
}: ButtonTextProps) {
  return (
    <button
      type={type}
      className={classNames(
        /**
         * @todo Don't make this a prop? I can see places we won't want this. It's essentially an empty button.
         */
        !!sizeMobile && sizeMobile === 'xs' && 'typography-product-button-label-xs',
        !!sizeMobile && sizeMobile === 'sm' && 'typography-product-button-label-small',
        !!sizeMobile && sizeMobile === 'md' && 'typography-product-button-label-medium',
        !!sizeMobile && sizeMobile === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!sizeDesktop &&
          sizeDesktop === 'xs' &&
          'typography-product-button-label-xs lg:px-4 lg:py-1.5',
        !!sizeDesktop &&
          sizeDesktop === 'sm' &&
          'typography-product-button-label-small lg:px-4 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'md' &&
          'typography-product-button-label-medium lg:px-6 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'lg' &&
          'typography-product-button-label-large lg:px-8 lg:py-4',
        !!size && size === 'xs' && 'typography-product-button-label-xs',
        !!size && size === 'sm' && 'typography-product-button-label-small',
        !!size && size === 'md' && 'typography-product-button-label-medium',
        !!size && size === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!className && className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLinkText({
  href,
  className,
  size,
  sizeMobile,
  sizeDesktop,
  children,
  ...rest
}: ButtonLinkTextProps) {
  return (
    <Link
      href={href}
      className={classNames(
        'font-medium',
        !!sizeMobile && sizeMobile === 'xs' && 'typography-product-button-label-xs',
        !!sizeMobile && sizeMobile === 'sm' && 'typography-product-button-label-small',
        !!sizeMobile && sizeMobile === 'md' && 'typography-product-button-label-medium',
        !!sizeMobile && sizeMobile === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!sizeDesktop &&
          sizeDesktop === 'xs' &&
          'typography-product-button-label-xs lg:px-4 lg:py-1.5',
        !!sizeDesktop &&
          sizeDesktop === 'sm' &&
          'typography-product-button-label-small lg:px-4 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'md' &&
          'typography-product-button-label-medium lg:px-6 lg:py-2',
        !!sizeDesktop &&
          sizeDesktop === 'lg' &&
          'typography-product-button-label-large lg:px-8 lg:py-4',
        !!size && size === 'xs' && 'typography-product-button-label-xs',
        !!size && size === 'sm' && 'typography-product-button-label-small',
        !!size && size === 'md' && 'typography-product-button-label-medium',
        !!size && size === 'lg' && 'typography-product-button-label-large px-8 py-4',
        !!className && className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
