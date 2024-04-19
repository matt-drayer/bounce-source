const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const admin = require('./adminBounce');
const getUserByEmail = require('../graphql/getUserByEmail');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, './data');
const filename = IS_PRODUCTION ? 'usersProd.json' : 'usersStaging.json';
const filePath = path.join(dataPath, filename);

const users = { accounts: [] };

async function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(async (listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        users.accounts.push(userRecord.toJSON());
      });
      // for (let i = 0; i < listUsersResult.users.length; i++) {
      //   const userRecord = listUsersResult.users[i];
      //   const user = await getUserByEmail({ email: userRecord.email });
      //   if (i === 166) {
      //     console.log(user);
      //     console.log(userRecord);
      //   }
      //   const isMatch = user?.users?.[0]?.email === userRecord?.email;
      //   if (!isMatch) {
      //     console.log('user', userRecord.email, 'did not match');
      //   } else if (i % 10 === 0) {
      //     console.log('i', i);
      //   }
      // }
      if (listUsersResult.pageToken) {
        // If there are more users, recursively list the next batch.
        return listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
}

// Start listing users from the beginning, 1000 at a time.
listAllUsers().then(() => {
  // fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  console.log('users', users);
});
