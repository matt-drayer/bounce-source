import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertSignupRequestMutation,
  InsertSignupRequestMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertSignupRequest(
    $accountType: String = ""
    $city: String = ""
    $cityId: uuid = null
    $country: String = ""
    $email: String = ""
    $fullName: String = ""
    $ip: String = ""
    $latitude: numeric = null
    $longitude: numeric = null
    $phoneNumber: String = ""
    $platform: String = "web"
    $preferredName: String = ""
    $region: String = ""
    $timezone: String = ""
    $username: String = ""
    $zip: String = ""
    $objects: [WelcomeEmailConfigurationInsertInput!] = []
  ) {
    insertSignupRequestsOne(
      object: {
        accountType: $accountType
        city: $city
        cityId: $cityId
        country: $country
        email: $email
        fullName: $fullName
        ip: $ip
        latitude: $latitude
        longitude: $longitude
        phoneNumber: $phoneNumber
        platform: $platform
        preferredName: $preferredName
        region: $region
        timezone: $timezone
        username: $username
        zip: $zip
      }
      onConflict: { constraint: signup_requests_pkey }
    ) {
      id
    }
    insertWelcomeEmailConfiguration(
      objects: $objects
      onConflict: { constraint: welcome_email_configuration_email_key, updateColumns: template }
    ) {
      affectedRows
    }
  }
`;

export const insertSignupRequest = async (variables: InsertSignupRequestMutationVariables) => {
  const data = await client.request<InsertSignupRequestMutation>(print(MUTATION), variables);
  return data;
};
