import { gql } from '@apollo/client';

export const GET_ACTIVE_COACH_PROFILES = gql`
  query getActiveCoachProfiles {
    userProfiles(where: { coachStatus: { _eq: "ACTIVE" } }, orderBy: { updatedAt: DESC }) {
      coachStatus
      coverImageFileName
      coverImagePath
      coverImageProviderUrl
      fullName
      gender
      genderPreference
      id
      preferredName
      profileImageFileName
      profileImagePath
      profileImageProviderUrl
      username
    }
  }
`;
