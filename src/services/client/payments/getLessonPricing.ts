import { getLessonItemizedTotal } from 'utils/shared/money/getLessonItemizedTotal';

interface Params {
  priceUnitAmount: number;
}

export type LessonPricing = ReturnType<typeof getLessonItemizedTotal>;

// NOTE: This should call an API that gets the pricing for a lesson
// Use an edge function so it's fast
export const getLessonPricing = async ({ priceUnitAmount }: Params) => {
  return getLessonItemizedTotal({ priceUnitAmount });
};
