import { GetTennisRatingScalesQuery } from 'types/generated/server';

export interface StaticProps {
  tennisRatingScales?: GetTennisRatingScalesQuery['tennisRatingScales'];
  normalizedRatingScale?: GetTennisRatingScalesQuery['tennisRatingScales'][0];
}

export interface Props extends StaticProps {
  isCoach: boolean;
}
