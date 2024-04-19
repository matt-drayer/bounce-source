import { gql } from '@apollo/client';

export const UPDATE_USER_ONBOARD_LEGAL = gql`
  mutation updateMarketingCommunicationPreferences(
    $id: uuid!
    $marketingPreference: CommunicationPreferenceStatusesEnum = ACTIVE
  ) {
    updateUserCommunicationPreferencesByPk(
      pkColumns: { id: $id }
      _set: { marketingEmail: $marketingPreference, marketingPush: $marketingPreference }
    ) {
      id
      marketingEmail
      marketingPush
    }
  }
`;

export const INSERT_ACCEPT_TERMS_OF_SERVICE = gql`
  mutation insertAcceptTermsOfService($ip: String = "", $userAgent: String = "", $userId: uuid!) {
    insertUserTermsOfServiceOne(
      object: { acceptedAt: "now()", ip: $ip, userAgent: $userAgent, userId: $userId }
    ) {
      id
      ip
      acceptedAt
      userAgent
      userId
    }
  }
`;
