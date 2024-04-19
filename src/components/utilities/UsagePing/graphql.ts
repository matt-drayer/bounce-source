import { gql } from '@apollo/client';

export const INSERT_USAGE_PING = gql`
  mutation insertUsagePing(
    $pathname: String = ""
    $userId: uuid
    $firebaseId: String
    $queryString: String = ""
    $platform: String = ""
    $ip: String = ""
    $timezone: String = ""
    $country: String = ""
    $region: String = ""
    $city: String = ""
    $zip: String = ""
    $ipResponse: jsonb
  ) {
    insertAppPingsOne(
      object: {
        pathname: $pathname
        userId: $userId
        firebaseId: $firebaseId
        queryString: $queryString
        platform: $platform
        ip: $ip
        timezone: $timezone
        country: $country
        region: $region
        city: $city
        zip: $zip
        ipResponse: $ipResponse
      }
    ) {
      id
    }
  }
`;
