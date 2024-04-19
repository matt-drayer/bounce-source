import { NORMALIZED_RATING_SYSTEM_SHORT_NAME } from 'constants/sports';
import { getTennisRatingScales } from 'services/server/graphql/queries/getTennisRatingScales';
import OnboardBio from 'screens/OnboardBio';
import { StaticProps } from 'screens/OnboardBio/props';

export const getStaticProps = async () => {
  const data = await getTennisRatingScales();
  const tennisRatingScales = data.tennisRatingScales;

  if (!tennisRatingScales) {
    throw new Error('Did not find rating scales in static props');
  }

  const normalizedRatingScale = tennisRatingScales.find(
    (scale) => scale.shortName === NORMALIZED_RATING_SYSTEM_SHORT_NAME,
  );

  if (!normalizedRatingScale?.id) {
    throw new Error('Did not find normalized rating scale in static props');
  }

  const props: StaticProps = {
    tennisRatingScales,
    normalizedRatingScale: normalizedRatingScale,
  };

  return {
    props,
  };
};

const PlayerOnboardBio: React.FC<StaticProps> = ({ tennisRatingScales, normalizedRatingScale }) => {
  return (
    <OnboardBio
      isCoach={false}
      tennisRatingScales={tennisRatingScales}
      normalizedRatingScale={normalizedRatingScale}
    />
  );
};

export default PlayerOnboardBio;
