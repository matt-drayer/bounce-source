import React from 'react';
import { ROOT_PAGE } from 'constants/pages';
import LogoWithName from 'svg/LogoWithName';
import Contact from 'screens/TournamentMarketPlace/ContactForm/ContactModal';
import Link from 'components/Link';

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center justify-between gap-4 px-16 py-8 md:flex-row  md:gap-0">
      <Link href={ROOT_PAGE}>
        <LogoWithName className="h-[1.75rem] w-[10rem] text-brand-fire-600" />
      </Link>
      <Contact isCTA={false} title={'Register now'} />
    </div>
  );
}
