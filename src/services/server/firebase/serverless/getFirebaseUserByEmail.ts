import admin from 'services/server/firebase/serverless/admin';

export const getFirebaseUserByEmail = async (email: string) => {
  const user = await admin.auth().getUserByEmail(email);

  if (!user) {
    throw new Error('Firebase user not found');
  }

  return user;
};
