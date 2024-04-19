import { NORMALIZED_RATING_SYSTEM_SHORT_NAME, NTRP_SHORT_NAME } from 'constants/sports';
import { GenderEnum } from 'types/generated/client';
import { convertNtrpToUtr as normalizeNtrp } from './convertNtrpToUtr';

interface Params {
  ratingScaleShortName: string;
  rating: number;
  gender?: GenderEnum | string | null;
}

export const normalizeRating = ({ ratingScaleShortName, rating, gender }: Params) => {
  switch (ratingScaleShortName) {
    case NTRP_SHORT_NAME:
      return normalizeNtrp({ rating, gender });
    case NORMALIZED_RATING_SYSTEM_SHORT_NAME:
      return rating;

    default:
      return rating;
  }
};
