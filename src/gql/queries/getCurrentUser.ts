import { gql } from '@apollo/client';

export const GET_VIEWER = gql`
  query getCurrentUser($id: uuid!) {
    usersByPk(id: $id) {
      id
      coachStatus
      email
      firebaseId
      fullName
      preferredName
      birthday
      duprId
      gender
      genderPreference
      stripeCustomerId
      stripeMerchantChargesEnabled
      stripeMerchantDetailsSubmitted
      stripeMerchantId
      stripeMerchantPayoutsEnabled
      username
      profileImageFileName
      profileImagePath
      profileImageProviderUrl
      coverImageFileName
      coverImagePath
      coverImageProviderUrl
      defaultCreditCardId
      tennisRatingScaleId
      tennisRating
      defaultSport
      defaultCoachPaymentFulfillmentChannel
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
      groups(where: { isActive: { _eq: true } }) {
        id
        isActive
        groupId
        group {
          id
          primarySport
        }
      }
      followingCoachesAggregate: followingAggregate(
        where: { followedProfile: { coachStatus: { _eq: "ACTIVE" } } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;
