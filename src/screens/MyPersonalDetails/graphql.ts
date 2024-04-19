import { gql } from '@apollo/client';

export const UPDATE_USER_GENDER = gql`
  mutation updateUserGender($id: uuid!, $gender: GenderEnum!, $genderPreference: String!) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { gender: $gender, genderPreference: $genderPreference }
    ) {
      id
      gender
      genderPreference
    }
  }
`;
