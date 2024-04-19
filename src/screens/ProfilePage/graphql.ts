import { gql } from '@apollo/client';

export const UPDATE_COACH_PROFILE = gql`
  mutation updateCoachProfile(
    $id: uuid!
    $fullName: String = ""
    $aboutMe: String = ""
    $preferredName: String = ""
    $existingCoachServices: [UserCoachServicesUpdates!] = []
    $newCoachServices: [UserCoachServicesInsertInput!] = []
    $qualificationObjects: [UsersCoachQualificationsInsertInput!] = []
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { fullName: $fullName, aboutMe: $aboutMe, preferredName: $preferredName }
    ) {
      id
      fullName
      preferredName
      username
      aboutMe
      countryId
      countrySubdivisionId
      cityName
      profile {
        id
        preferredName
        fullName
        aboutMe
        username
        countryId
        countrySubdivisionId
        cityName
      }
    }
    updateUserCoachServicesMany(updates: $existingCoachServices) {
      returning {
        coverImageUrl
        currency
        description
        id
        priceUnitAmount
        title
        type
        userId
      }
    }
    insertUserCoachServices(
      objects: $newCoachServices
      onConflict: {
        constraint: user_coach_services_pkey
        updateColumns: [title, description, currency, coverImageUrl, priceUnitAmount, type]
      }
    ) {
      returning {
        coverImageUrl
        currency
        description
        id
        priceUnitAmount
        title
        type
        userId
      }
    }
    insertUsersCoachQualifications(
      objects: $qualificationObjects
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

export const UPDATE_PLAYER_PROFILE = gql`
  mutation updatePlayerProfile(
    $id: uuid!
    $fullName: String = ""
    $aboutMe: String = ""
    $preferredName: String = ""
    $normalizedTennisRating: numeric
    $normalizedTennisRatingScaleId: uuid
    $tennisRating: numeric
    $tennisRatingScaleId: uuid
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        fullName: $fullName
        aboutMe: $aboutMe
        preferredName: $preferredName
        normalizedTennisRating: $normalizedTennisRating
        normalizedTennisRatingScaleId: $normalizedTennisRatingScaleId
        tennisRating: $tennisRating
        tennisRatingScaleId: $tennisRatingScaleId
      }
    ) {
      id
      fullName
      preferredName
      username
      aboutMe
      countryId
      countrySubdivisionId
      cityName
      normalizedTennisRating
      normalizedTennisRatingScaleId
      tennisRating
      tennisRatingScaleId
      profile {
        id
        preferredName
        fullName
        aboutMe
        username
        countryId
        countrySubdivisionId
        cityName
        normalizedTennisRating
        normalizedTennisRatingScaleId
        tennisRating
        tennisRatingScaleId
      }
    }
  }
`;

export const GET_COUNTRIES_AND_ACTIVE_SUBDIVISIONS = gql`
  query getCountriesAndActiveSubdivisions($countryId: String!) {
    countries {
      id
      name
      slug
    }
    countrySubdivisions(where: { countryId: { _eq: $countryId } }) {
      id
      name
      type
    }
  }
`;

export const GET_AVAILABLE_COACH_QUALIFICATIONS = gql`
  query getAvailableCoachQualifications {
    coachQualifications(orderBy: { order: ASC }) {
      id
      name
      order
      groupId
      displayKey
    }
  }
`;

export const GET_TENNIS_RATING_SCALES = gql`
  query getTennisRatingScales {
    tennisRatingScales(orderBy: { order: ASC }) {
      id
      maximum
      minimum
      name
      order
      shortName
    }
  }
`;

export const GET_COACH_EARNINGS_UNIT_AMOUNT = gql`
  query getCoachEarningsUnitAmount($sellerUserId: uuid!) {
    lessonOrdersAggregate(
      where: { sellerUserId: { _eq: $sellerUserId }, status: { _eq: SUCCEEDED } }
    ) {
      aggregate {
        sum {
          transferUnitAmount
        }
      }
    }
  }
`;
