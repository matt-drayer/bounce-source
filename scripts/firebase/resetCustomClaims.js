require('dotenv').config('../.env');
const getUsers = require('../graphql/getUsers');
const getUserByEmail = require('../graphql/getUserByEmail');

const EMAIL = '';

let admin;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  admin = require('./admin');
} else {
  admin = require('./adminStaging');
}

const MINUTE = 1000 * 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const SubscriptionType = {
  SmartMoneyAlerts: 'SMART_MONEY_ALERTS',
  DashboardStandard: 'DASHBOARD_STANDARD',
};

const JwtSubscriptionName = {
  [SubscriptionType.SmartMoneyAlerts]: 'alerts',
  [SubscriptionType.DashboardStandard]: 'dashboard',
};

const toPostgresArray = (arr) => {
  return `{${arr.join(',')}}`;
};

const run = async (email) => {
  const query = email ? getUserByEmail({ email }) : getUsers();
  const data = await query;
  console.log({ data });
  const users = data.users || [];

  console.log({ users });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const opraAgreementCompletedAt = user.opraAgreementCompletedAt || '';
    const launchAccessEndsAt =
      user.launchAccessEndsAt || new Date(Date.now() - 365 * DAY).toISOString();
    const allUserSubscriptions = user.subscriptions || [];

    const subscriptionSet = new Set();
    allUserSubscriptions.forEach((subscription) => {
      // @ts-ignore
      const jwtSubscriptionName = JwtSubscriptionName[subscription.type];
      if (subscription.type && jwtSubscriptionName) {
        subscriptionSet.add(jwtSubscriptionName);
      } else {
        console.log('--- ERROR ---');
      }
    });
    const subscriptions = Array.from(subscriptionSet);

    const customClaims = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': 'user',
        'x-hasura-allowed-roles': ['user', 'anonymous'],
        'x-hasura-user-id': user.id,
        'x-hasura-subscriptions': toPostgresArray(subscriptions),
        'x-hasura-opra-agreement-ends': opraAgreementCompletedAt,
        'x-hasura-launch-access-ends': launchAccessEndsAt,
      },
    };

    console.log({ customClaims });

    await admin
      .auth()
      .setCustomUserClaims(user.id, customClaims)
      .then(() => {
        console.log('-- SET CLAIMS');
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref('metadata/' + user.id);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: Date.now() });
      })
      .catch((error) => {
        console.log('--- ERROR = ', error);
      });
  }

  console.log('+++++ COMPLETE +++++');

  return;
};

run(EMAIL);
