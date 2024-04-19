require('dotenv').config();
const admin = require('./adminAdvantage');
const updateUserEmail = require('../graphql/updateUserEmail');

const EMAIL = '';

const updateEmailAddress = async (email) => {
  const user = await admin.auth().getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  console.log('user = ', user.toJSON());

  const { uid } = user;

  await admin
    .auth()
    .updateUser(uid, {
      emailVerified: true,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });

  // ADD EMAIL ADDRESS TO SEND IN BLUE AND ADD TO THE CORRECT GROUPS
};

(async () => {
  await updateEmailAddress(EMAIL);
  process.exit(1);
})();
