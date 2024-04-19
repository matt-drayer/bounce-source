import { gql } from '@apollo/client';

export const SET_USER_COACH_QUALIFICATIONS = gql`
  mutation setUserCoachQualifications(
    $userId: uuid!
    $coachExperienceYears: numeric = 0
    $objects: [UsersCoachQualificationsInsertInput!] = {}
  ) {
    updateUsersByPk(
      pkColumns: { id: $userId }
      _set: { coachExperienceYears: $coachExperienceYears, coachExperienceSetAt: "now()" }
    ) {
      id
      coachExperienceSetAt
      coachExperienceYears
    }
    insertUsersCoachQualifications(
      objects: $objects
      onConflict: {
        constraint: users_coach_qualifications_user_id_coach_qualification_id_key
        updateColumns: status
      }
    ) {
      returning {
        id
        status
        coachQualificationId
        userId
      }
    }
  }
`;
