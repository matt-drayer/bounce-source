const admin = require('./adminBounce');
const dataStaging = require('./data/usersStaging.json');

const migrateToBounce = async () => {
  const accounts = dataStaging.accounts;

  for (let i = 0; i < accounts.length; i++) {
    const userToMigrate = accounts[i];

    if (userToMigrate.email === 'trey+migrate@bounce.game') {
      console.log('userToMigrate', userToMigrate);

      const createUserObject = {
        uid: userToMigrate.uid,
        email: userToMigrate.email,
        emailVerified: userToMigrate.emailVerified,
        displayName: userToMigrate.displayName,
        photoURL: userToMigrate.photoURL,
        phoneNumber: userToMigrate.phoneNumber,
        disabled: userToMigrate.disabled,
        passwordHash: Buffer.from(userToMigrate.passwordHash, 'base64'),
        passwordSalt: Buffer.from(userToMigrate.passwordSalt, 'base64'),
      };

      await admin
        .auth()
        .createUser(createUserObject)
        .then((userRecord) => {
          console.log('Successfully created user:', userRecord.uid);

          // If you want to set custom claims:
          return admin.auth().setCustomUserClaims(userRecord.uid, userToMigrate.customClaims);
        })
        .then(() => {
          console.log('Custom claims set for user.');
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }
  }
};

migrateToBounce();
