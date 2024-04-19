import admin from 'services/server/firebase/serverless/admin';

export const changeFirebaseEmail = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
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
    });
};
