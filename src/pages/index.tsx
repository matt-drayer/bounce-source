import { GetStaticProps } from 'next';
import { getTournamentsForMarketplace } from 'services/server/graphql/queries/getTournamentsForMarketplace';
import TournamentMarketPlace from 'screens/TournamentMarketPlace';

const REVALIDATE_IN_SECONDS = 60 * 2;

export const getStaticProps: GetStaticProps = async () => {
  const tournaments = await getTournamentsForMarketplace();

  return {
    props: {
      tournaments,
    },
    revalidate: REVALIDATE_IN_SECONDS,
  };
};

export default TournamentMarketPlace;
