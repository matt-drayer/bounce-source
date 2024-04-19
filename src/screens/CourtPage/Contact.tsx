import * as React from 'react';
import Globe from 'svg/Globe';
import Mail from 'svg/Mail';
import Phone from 'svg/Phone';
import Link from 'components/Link';

interface ContactProps {
  email?: string;
  phone?: string;
  website?: string;
  header?: string;
}

export default function Contact({ email, phone, website, header = 'Contact' }: ContactProps) {
  if (!email && !phone && !website) {
    return null;
  }

  return (
    <div className="mt-ds-3xl border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode">
      <h3 className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {header}
      </h3>
      <div className="mt-6 space-y-3">
        {!!email && (
          <div>
            <Link
              href={`mailto:${email}`}
              isExternal
              className="inline-flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
            >
              <Mail className="mr-2 h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
              <span className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {email}
              </span>
            </Link>
          </div>
        )}
        {!!phone && (
          <div>
            <Link
              href={`tel:${phone}`}
              isExternal
              className="inline-flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
            >
              <Phone className="mr-2 h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
              <span className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {phone}
              </span>
            </Link>
          </div>
        )}
        {!!website && (
          <div>
            <Link
              href={website}
              isExternal
              className="inline-flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
            >
              <Globe className="mr-2 h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
              <span className="typography-product-body break break-all text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {website}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
