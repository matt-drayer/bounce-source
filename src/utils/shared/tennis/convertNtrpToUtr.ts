import { GenderEnum } from 'types/generated/client';

interface Params {
  rating: number;
  gender?: GenderEnum | string | null;
}

const LOW_RANGE_CUTOFF = 4.5;
const MID_RANGE_CUTOFF = 5;
// Scale it slightly so it hits middle of the ranges
const LOW_CONVERSION_FACTOR = 1.8;
const MID_CONVERSION_FACTOR = 2;
const HIGH_CONVERSION_FACTOR = 2.2;
const FEMALE_NTRP_FACTOR = 0.5;
const NON_GENDER_NTRP_FACTOR = 0.25; // Split the difference between male and female since we don't know

// Source: https://www.usta.com/en/home/play/adult-tennis/programs/northerncalifornia/gen-gap-tournament.html
export const convertNtrpToUtr = ({ rating, gender }: Params) => {
  let genderAdjustedRating = rating;

  if (gender === GenderEnum.Female) {
    genderAdjustedRating = genderAdjustedRating - FEMALE_NTRP_FACTOR;
  } else if (gender !== GenderEnum.Male) {
    genderAdjustedRating = genderAdjustedRating - NON_GENDER_NTRP_FACTOR;
  }

  let normaliedRating = rating;
  if (rating < LOW_RANGE_CUTOFF) {
    normaliedRating = genderAdjustedRating * LOW_CONVERSION_FACTOR;
  } else if (rating < MID_RANGE_CUTOFF) {
    normaliedRating = genderAdjustedRating * MID_CONVERSION_FACTOR;
  } else {
    normaliedRating = genderAdjustedRating * HIGH_CONVERSION_FACTOR;
  }

  return parseFloat(normaliedRating.toFixed(2));
};
