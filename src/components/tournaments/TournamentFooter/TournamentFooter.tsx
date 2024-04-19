import * as React from 'react';
import { ROOT_PAGE } from 'constants/pages';
import Link from 'components/Link';

export default function TournamentFooter() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-between sm:flex-row">
      <Link href={ROOT_PAGE}>
        <img src="/images/tournaments/orange-logo.svg" alt="logo" />
      </Link>
      <span className="mt-2 text-brand-gray-600 sm:mt-0">
        © {new Date().getFullYear()}, All Rights Reserved
      </span>
    </footer>
  );
}
