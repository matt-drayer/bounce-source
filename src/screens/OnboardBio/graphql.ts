import { gql } from '@apollo/client';

export const UPDATE_USER_ONBOARD_BIO = gql`
  mutation updateUserOnboardBio(
    $id: uuid!
    $birthday: date!
    $gender: GenderEnum!
    $genderPreference: String = "" # $normalizedTennisRating: numeric # $normalizedTennisRatingScaleId: uuid # $tennisRating: numeric # $tennisRatingScaleId: uuid
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        birthday: $birthday
        gender: $gender
        genderPreference: $genderPreference
        # normalizedTennisRating: $normalizedTennisRating
        # normalizedTennisRatingScaleId: $normalizedTennisRatingScaleId
        # tennisRating: $tennisRating
        # tennisRatingScaleId: $tennisRatingScaleId
      }
    ) {
      id
      gender
      genderPreference
      fullName
      email
      birthday
      normalizedTennisRating
      normalizedTennisRatingScaleId
      tennisRating
      tennisRatingScaleId
    }
  }
`;
