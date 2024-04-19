import { ApolloClient } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { GetExistingUserQuery } from 'types/generated/client';
import { GET_AUTH_USER } from 'gql/queries/registration';
import { FirebaseUserOrNull, updateViewerToken } from 'services/client/token';

const POLL_TIME_MS = 300;
const TOTAL_POLL_TIME_MS = 60 * 1000;
const MAX_POLLS = TOTAL_POLL_TIME_MS / POLL_TIME_MS;

type Resolve = (value: unknown) => void;
type Reject = (reason?: any) => void;

export const pollForNewUser = async (client: ApolloClient<object>, user: FirebaseUserOrNull) => {
  let requestMade = 0;
  let success = false;

  if (!user?.uid) {
    return Promise.reject(new Error('Did not have a valid user ID'));
  }

  const makeQuery = async (resolve: Resolve, reject: Reject) => {
    try {
      requestMade = requestMade + 1;

      if (requestMade === MAX_POLLS) {
        return reject(new Error('User poll timed out'));
      }

      const result = await client.query<GetExistingUserQuery>({
        query: GET_AUTH_USER,
        variables: { firebaseId: user.uid },
        fetchPolicy: 'network-only',
      });

      if (result.errors) {
        Sentry.captureException(`Errors in sign up poll result.errors: ${result.errors}`);
        setTimeout(makeQuery, POLL_TIME_MS, resolve, reject);
      } else if (result.data && result.data.users?.length) {
        success = true;
        return resolve(result.data.users[0]);
      } else if (!success) {
        setTimeout(makeQuery, POLL_TIME_MS, resolve, reject);
      }
    } catch (e) {
      Sentry.captureException(`Errors in sign up poll catch block: ${e}`);
      setTimeout(makeQuery, POLL_TIME_MS, resolve, reject);
    }
  };

  return updateViewerToken(user, true).then((resp) => {
    if (!resp.token) {
      throw new Error('Could not find user token');
    }

    return new Promise(makeQuery);
  });
};
