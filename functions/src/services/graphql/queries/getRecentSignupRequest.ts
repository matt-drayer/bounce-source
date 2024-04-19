import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetRecentSignupRequestQuery,
  GetRecentSignupRequestQueryVariables,
} from '../../types/generated';
import createClient from '../createClient';

const QUERY = gql`
  query getRecentSignupRequest($email: String!) {
    signupRequests(
      where: { email: { _eq: $email } }
      orderBy: { createdAt: DESC_NULLS_LAST }
      limit: 1
    ) {
      accountType
      createdAt
      deletedAt
      email
      id
      ip
      updatedAt
      username
      fullName
      preferredName
      zip
      timezone
      region
      platform
      fullDetails
      country
      city
      latitude
      longitude
      cityId
      eventOrganizerAccountType
      phoneNumber
    }
    welcomeEmailConfiguration(where: { email: { _eq: $email } }) {
      email
      id
      template
    }
  }
`;

const getRecentSignupRequest = (variables: GetRecentSignupRequestQueryVariables) => {
  const client = createClient();
  return client.request<GetRecentSignupRequestQuery>(print(QUERY), variables);
};

export default getRecentSignupRequest;
