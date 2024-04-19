import * as React from 'react';
import { ROOT_PAGE, TOURNAMENTS_PAGE } from 'constants/pages';
import Head from 'components/utilities/Head';

type Props = {
  noIndex: boolean;
  title: string;
  description: string;
  ogImage: string;
};

export default function TournamentHeader(props: Props) {
  const { description, noIndex, ogImage, title } = props;

  return (
    <>
      <Head noIndex={noIndex} title={title} description={description} ogImage={ogImage} />
      <header className="flex w-full flex-row items-center justify-between">
        <a href={ROOT_PAGE} className="mr-2">
          <img src="/images/tournaments/orange-logo.svg" alt="logo" />
        </a>
        <a
          href={TOURNAMENTS_PAGE}
          className="button-rounded-inline flex h-[39px] w-full max-w-[172px] items-center justify-center border border-solid border-brand-gray-1000 text-[1rem] text-brand-gray-1000"
        >
          View tournaments
        </a>
      </header>
    </>
  );
}
