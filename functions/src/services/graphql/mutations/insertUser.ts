import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { InsertUserMutation, InsertUserMutationVariables } from '../../types/generated';
import createClient from '../createClient';

const INSERT_USER = gql`
  mutation insertUser(
    $id: uuid!
    $email: String!
    $firebaseId: String!
    $stripeCustomerId: String!
    $identityData: [UserAuthIdentitiesInsertInput!] = {}
    $latestAuthProvider: String!
    $originalAuthProvider: String!
    $fullName: String!
    $preferredName: String!
    $coachStatus: CoachStatusEnum!
    $city: String = ""
    $country: String = ""
    $fullDetails: jsonb = ""
    $ip: String = ""
    $platform: String = ""
    $region: String = ""
    $timezone: String = ""
    $zip: String = ""
    $username: String
    $claimData: [UsernamesClaimedInsertInput!] = []
    $logData: [UsernameLogsInsertInput!] = []
    $latitude: numeric
    $longitude: numeric
    $activeCityId: uuid
    $geometry: geography
    $phoneNumber: String
    $eventOrganizerAccountType: EventOrganizerAccountTypesEnum
  ) {
    insertUsersOne(
      object: {
        id: $id
        username: $username
        email: $email
        firebaseId: $firebaseId
        stripeCustomerId: $stripeCustomerId
        authIdentities: { data: $identityData }
        latestAuthProvider: $latestAuthProvider
        originalAuthProvider: $originalAuthProvider
        fullName: $fullName
        preferredName: $preferredName
        coachStatus: $coachStatus
        registrationDetails: {
          data: {
            city: $city
            country: $country
            fullDetails: $fullDetails
            ip: $ip
            platform: $platform
            region: $region
            timezone: $timezone
            zip: $zip
          }
          onConflict: {
            constraint: user_registration_details_user_id_key
            updateColumns: updatedAt
          }
        }
        usernamesClaimed: {
          data: $claimData
          onConflict: { constraint: usernames_claimed_username_key, updateColumns: updatedAt }
        }
        usernameLogs: {
          data: $logData
          onConflict: { constraint: username_logs_pkey, updateColumns: updatedAt }
        }
        latitude: $latitude
        longitude: $longitude
        activeCityId: $activeCityId
        geometry: $geometry
        phoneNumber: $phoneNumber
        eventOrganizerAccountType: $eventOrganizerAccountType
      }
    ) {
      id
      firebaseId
      email
      stripeCustomerId
      updatedAt
      createdAt
      latitude
      longitude
      fullName
      phoneNumber
      eventOrganizerAccountType
      activeCity {
        id
        name
        countrySubdivision {
          id
          name
        }
      }
    }
  }
`;

const insertUser = (variables: InsertUserMutationVariables) => {
  const client = createClient();
  return client.request<InsertUserMutation>(print(INSERT_USER), variables);
};

export default insertUser;
