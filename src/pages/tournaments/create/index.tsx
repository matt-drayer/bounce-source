import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import TournamentsBuilder from 'screens/TournamentsBuilder';
import InjectIntercom from 'components/utilities/InjectIntercom';

const CreateTournament: NextPage<{}> = ({}) => (
  <InjectIntercom>
    <TournamentsBuilder eventData={{}} isEdit={false} />
  </InjectIntercom>
);

export const getStaticProps: GetStaticProps<{}> = async () => {
  return {
    props: {},
    revalidate: 600,
  };
};

export default CreateTournament;
