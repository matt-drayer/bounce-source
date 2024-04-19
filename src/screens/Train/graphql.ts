import { gql } from '@apollo/client';

export const GET_ACTIVE_LESSONS_FROM_FOLLOWED_COACHES = gql`
  query getActiveLessonsFromFollowedCoaches($followerUserId: uuid!) {
    userFollows(
      where: {
        followedProfile: { coachStatus: { _eq: "ACTIVE" } }
        status: { _eq: ACTIVE }
        followerUserId: { _eq: $followerUserId }
      }
    ) {
      id
      followedUserId
      followerUserId
      followedProfile {
        coachStatus
        coverImageFileName
        coverImagePath
        coverImageProviderUrl
        fullName
        id
        preferredName
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        username
        coachLessons(
          where: {
            status: { _eq: ACTIVE }
            startDateTime: { _gte: "now()" }
            privacy: { _eq: PUBLIC }
          }
        ) {
          ...lessonFields
        }
      }
    }
  }
`;
