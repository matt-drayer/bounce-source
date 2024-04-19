import { gql } from '@apollo/client';

export const GET_AUTH_USER = gql`
  query getExistingUser($firebaseId: String!) {
    users(where: { firebaseId: { _eq: $firebaseId } }) {
      id
      email
      username
      fullName
      coachStatus
    }
  }
`;

export const INSERT_SIGNUP_REQUEST = gql`
  mutation insertSignupRequest(
    $accountType: String!
    $email: String!
    $fullName: String!
    $preferredName: String!
    $username: String!
    $ip: String = ""
    $timezone: String = ""
    $country: String = ""
    $region: String = ""
    $city: String = ""
    $zip: String = ""
    $platform: String = ""
    $fullDetails: jsonb
    $latitude: numeric
    $longitude: numeric
    $cityId: uuid
    $phoneNumber: String
    $eventOrganizerAccountType: EventOrganizerAccountTypesEnum
  ) {
    insertSignupRequestsOne(
      object: {
        accountType: $accountType
        email: $email
        fullName: $fullName
        preferredName: $preferredName
        username: $username
        ip: $ip
        timezone: $timezone
        country: $country
        region: $region
        city: $city
        zip: $zip
        fullDetails: $fullDetails
        platform: $platform
        latitude: $latitude
        longitude: $longitude
        cityId: $cityId
        phoneNumber: $phoneNumber
        eventOrganizerAccountType: $eventOrganizerAccountType
      }
    ) {
      id
    }
  }
`;

export const CHECK_USERNAME_AVAILABILITY = gql`
  query checkUsernameAvailability($username: String!) {
    usernamesActive(where: { username: { _eq: $username } }) {
      username
    }
    usernamesClaimed(where: { username: { _eq: $username } }) {
      id
      username
    }
  }
`;
