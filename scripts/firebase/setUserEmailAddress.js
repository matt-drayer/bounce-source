const admin = require('./adminAdvantage');
// const updateUserEmail = require('../graphql/updateUserEmail');

const OLD_EMAIL = 'rgargani@globalatg.com';
const NEW_EMAIL = 'cgargani@comcast.net';

const updateEmailAddress = async (oldEmail, newEmail) => {
  const user = await admin.auth().getUserByEmail(oldEmail);

  if (!user) {
    throw new Error('User not found');
  }

  console.log('user = ', user.toJSON());

  const { uid } = user;

  await admin
    .auth()
    .updateUser(uid, {
      email: newEmail,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });

  // resp = await updateUserEmail({ id: uid, email: newEmail });

  // console.log('DB updated user = ', JSON.stringify(resp, null, 2));

  // ADD EMAIL ADDRESS TO SEND IN BLUE AND ADD TO THE CORRECT GROUPS
};

(async () => {
  await updateEmailAddress(OLD_EMAIL, NEW_EMAIL);
  process.exit(1);
})();
