import * as React from 'react';
import { MY_COACHES_PAGE } from 'constants/pages';
import CoachBadge from 'svg/CoachBadge';
import Link from 'components/Link';

const ButtonMyCoaches = () => {
  return (
    <Link
      href={MY_COACHES_PAGE}
      className="button-base flex items-center rounded-full border border-color-brand-primary py-1 pl-2.5 pr-3 text-sm leading-5 text-color-brand-primary"
    >
      <div className="mr-1 h-4 w-4">
        <CoachBadge className="h-6 w-6" />
      </div>
      View Coaches
    </Link>
  );
};

export default ButtonMyCoaches;
