import admin from './admin';

export const createUser = async ({ email, password }: { email: string; password: string }) => {
  return admin.auth().createUser({
    email,
    password,
  });
};
