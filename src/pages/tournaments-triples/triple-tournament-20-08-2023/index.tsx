import { GetStaticProps, NextPage } from 'next';

// const SLUG = 'triple-tournament-20-08-2023';

const Tournament: NextPage<{
  // tournament: TournamentModel;
  // teamsCount: number;
}> = () => (
  // <TriplesTournamentPage tournament={tournament} teamsCount={teamsCount} />
  <></>
);

export const getStaticProps: GetStaticProps<{
  // tournament: TournamentModel;
}> = async () => {
  // const tournament = await fetchTripleTournamentBySlug(SLUG);
  //
  // if (!tournament) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      // tournament,
      // teamsCount: tournament['Triple tournament teams']?.length || 0,
    },
    revalidate: 1800,
  };
};

export default Tournament;
