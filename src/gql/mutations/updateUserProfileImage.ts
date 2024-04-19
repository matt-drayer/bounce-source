import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE_IMAGE = gql`
  mutation updateUserProfileImage(
    $id: uuid!
    $profileImageFileName: String!
    $profileImagePath: String!
    $profileImageProvider: String!
    $profileImageProviderId: String!
    $profileImageProviderUrl: String!
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        profileImageFileName: $profileImageFileName
        profileImagePath: $profileImagePath
        profileImageProvider: $profileImageProvider
        profileImageProviderId: $profileImageProviderId
        profileImageProviderUrl: $profileImageProviderUrl
      }
    ) {
      id
      profileImageFileName
      profileImagePath
      profileImageProvider
      profileImageProviderId
      profileImageProviderUrl
      profile {
        id
        profileImageFileName
        profileImagePath
        profileImageProvider
        profileImageProviderUrl
      }
    }
    insertUserImageLogOne(
      object: {
        fileName: $profileImageFileName
        provider: $profileImageProvider
        providerId: $profileImageProviderId
        providerUrl: $profileImageProviderUrl
        userId: $id
        path: $profileImagePath
      }
    ) {
      id
    }
  }
`;
