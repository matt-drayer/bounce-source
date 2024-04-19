import { gql } from '@apollo/client';

export const GET_ALL_ACTIVE_LESSONS = gql`
  query getAllActiveLessons {
    lessons(where: { status: { _eq: ACTIVE } }) {
      id
      title
      startDateTime
      endDateTime
      description
      coverImageFileName
      coverImagePath
      coverImageProviderUrl
      currency
      participantLimit
      priceUnitAmount
      privacy
      status
      type
      typeCustom
      userCustomCourt {
        id
        title
        fullAddress
      }
      ownerProfile {
        id
        fullName
        preferredName
        coverImageFileName
        coverImagePath
        coverImageProviderUrl
        coachStatus
        gender
        genderPreference
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        username
      }
    }
  }
`;
