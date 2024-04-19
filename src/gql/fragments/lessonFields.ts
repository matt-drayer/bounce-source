import { gql } from '@apollo/client';

export const LESSON_FIELDS = gql`
  fragment lessonFields on Lessons {
    cancelReason
    canceledAt
    coverImageFileName
    coverImagePath
    coverImageProviderUrl
    createdAt
    currency
    deletedAt
    description
    endDateTime
    id
    ownerUserId
    paymentFulfillmentChannel
    participantLimit
    priceUnitAmount
    privacy
    reminderEventId
    sport
    startDateTime
    status
    locale
    timezoneName
    timezoneAbbreviation
    timezoneOffsetMinutes
    title
    type
    typeCustom
    updatedAt
    publishedAt
    userCustomCourtId
    usedTemplateId
    ownerProfile {
      id
      preferredName
      profileImageFileName
      profileImagePath
      profileImageProviderUrl
      fullName
      username
    }
    userCustomCourt {
      createdAt
      fullAddress
      id
      title
      updatedAt
    }
    participantsAggregate(where: { status: { _eq: ACTIVE } }) {
      aggregate {
        count
      }
    }
    participants(where: { status: { _eq: ACTIVE } }) {
      id
      userId
      lessonId
      userProfile {
        id
        preferredName
        fullName
        username
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        coverImageFileName
        coverImagePath
        coverImageProviderUrl
      }
    }
    equipment {
      id
      lessonId
      equipmentOptionId
    }
  }
`;
