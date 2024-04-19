import React from 'react';
import Home from 'svg/Home';
import Breadcrumbs from 'components/Breadcrumbs';
import { Props } from './types';

export default function NavSection({ event }: Props) {
  const breadcrumbs = [
    {
      label: <Home className="h-5 w-5 text-color-text-lightmode-secondary" />,
      url: '/',
    },
    { label: event.title, url: '#', isActivePage: true },
  ];
  return (
    <>
      <div className="items-center gap-6 p-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </>
  );
}
