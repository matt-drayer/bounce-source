import React from 'react';
import Link from 'next/link';
import { HOME_PAGE, TOURNAMENT_ORGANIZER_DASHBOARD } from 'constants/pages';
import Dashboard from 'svg/Dashboard';
import LogoWithSplash from 'svg/LogoWithSplash';
import Notification from 'svg/Notification';
import Tournament from 'svg/Tournament';

const nav = [
  {
    ref: TOURNAMENT_ORGANIZER_DASHBOARD,
    text: 'Dashboard',
    renderIcon: (classes: string) => <Dashboard className={classes} />,
  },
  {
    ref: '/',
    text: 'Tournaments',
    renderIcon: (classes: string) => <Tournament className={classes} />,
  },
  {
    ref: '/',
    text: 'Notification',
    renderIcon: (classes: string) => <Notification className={classes} />,
  },
];

export default function Sidebar() {
  return (
    <aside className="max-w-[225px] border-r border-color-border-input-lightmode bg-gray-50 p-4">
      <a href={HOME_PAGE} className="flex p-4">
        <LogoWithSplash className="h-7 w-full max-w-[130px]" />
      </a>
      <nav>
        <ul>
          {nav.map(({ ref, text, renderIcon }, index) => {
            return (
              <li
                key={index}
                className="
                    group
                    flex
                    cursor-pointer
                    items-center
                    p-4
                    text-color-text-lightmode-secondary transition-all
                    hover:bg-color-bg-lightmode-tertiary
                    dark:text-color-text-darkmode-secondary"
              >
                {renderIcon(
                  'mr-2 group-hover:[&>path]:fill-color-bg-lightmode-brand fill-color-text-lightmode-secondary w-6 h-6',
                )}
                <Link href={ref} className="group-hover:text-color-text-brand">
                  {text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
