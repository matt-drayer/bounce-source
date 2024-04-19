import { differenceInMonths } from 'date-fns';

export const calculateYearsOfCoachingExperience = (
  initialYearsOfCoachingExperience: number,
  coachExperienceSetAt: Date,
) => {
  const monthsSinceSet = differenceInMonths(new Date(), coachExperienceSetAt);
  const yearsSinceSet = monthsSinceSet / 12;
  const yearsOfExperience = Math.round(initialYearsOfCoachingExperience + yearsSinceSet);

  return yearsOfExperience;
};
