import admin from 'services/server/firebase/serverless/admin';

export const setEmailAddressVerified = async (email: string) => {
  const user = await admin.auth().getUserByEmail(email);

  if (!user) {
    throw new Error('Firebase user not found');
  }

  console.log('user = ', user.toJSON());

  const { uid } = user;

  return admin
    .auth()
    .updateUser(uid, {
      emailVerified: true,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
      return userRecord;
    });
};
