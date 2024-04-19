import * as React from 'react';
import ChevronRight from 'svg/ChevronRight';
import Link from 'components/Link';

interface Props {
  breadcrumbs: {
    label: React.ReactNode;
    url: string;
    isActivePage?: boolean;
  }[];
}

export default function Breadcrumbs({ breadcrumbs }: Props) {
  return (
    <div className="flex flex-wrap items-center">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <React.Fragment key={index}>
            {breadcrumb.isActivePage ? (
              <span className="typography-product-link text-color-brand-primary">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.url}
                className="typography-product-link text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
              >
                {breadcrumb.label}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon">
                <ChevronRight className="w-5" />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
