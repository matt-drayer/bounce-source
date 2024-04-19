import { gql } from '@apollo/client';

export const GET_RATING_SCALES = gql`
  query getSportsRatingScales {
    pickleballRatingScales {
      id
      maximum
      minimum
      name
      order
      shortName
    }
    tennisRatingScales {
      id
      maximum
      minimum
      name
      order
      shortName
    }
  }
`;
