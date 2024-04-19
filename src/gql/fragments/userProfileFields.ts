import { gql } from '@apollo/client';

export const USER_PROFILE_FIELDS = gql`
  fragment userProfileFields on UserProfiles {
    id
    username
    profileImageFileName
    profileImagePath
    profileImageProviderUrl
    preferredName
    fullName
    coachStatus
    coverImageFileName
    coverImagePath
    coverImageProviderUrl
    aboutMe
    aboutMeVideoUrl
    cityName
    gender
    country {
      id
      iso2
      iso3
      name
    }
    countrySubdivision {
      code
      id
      name
      type
    }
    coachExperienceYears
    coachExperienceSetAt
    coachLessonsAggregate(where: { status: { _eq: ACTIVE } }) {
      aggregate {
        count
      }
    }
    followersAggregate(where: { status: { _eq: ACTIVE } }) {
      aggregate {
        count
      }
    }
    followers(limit: 5, where: { status: { _eq: ACTIVE } }) {
      followerProfile {
        id
        username
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        fullName
        preferredName
      }
      followerUserId
      followedUserId
    }
    coachServices {
      currency
      description
      id
      title
      priceUnitAmount
      type
      coverImageFileName
      coverImagePath
      coverImageProviderUrl
    }
    coachQualifications(where: { status: { _eq: ACTIVE } }) {
      id
      status
      qualification {
        id
        name
        order
        groupId
        displayKey
      }
    }
    normalizedTennisRating
    normalizedTennisRatingScale {
      id
      name
      shortName
    }
    tennisRating
    tennisRatingScale {
      id
      name
      shortName
    }
    tennisSkillLevel {
      id
      isDisplayed
      rank
      displayName
    }
    pickleballSkillLevel {
      id
      isDisplayed
      rank
      displayName
    }
  }
`;
