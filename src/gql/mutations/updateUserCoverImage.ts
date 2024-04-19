import { gql } from '@apollo/client';

export const UPDATE_USER_COVER_IMAGE = gql`
  mutation updateUserCoverImage(
    $id: uuid!
    $coverImageFileName: String!
    $coverImagePath: String!
    $coverImageProvider: String!
    $coverImageProviderId: String!
    $coverImageProviderUrl: String!
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        coverImageFileName: $coverImageFileName
        coverImagePath: $coverImagePath
        coverImageProvider: $coverImageProvider
        coverImageProviderId: $coverImageProviderId
        coverImageProviderUrl: $coverImageProviderUrl
      }
    ) {
      id
      coverImageFileName
      coverImagePath
      coverImageProvider
      coverImageProviderId
      coverImageProviderUrl
      profile {
        id
        coverImageFileName
        coverImagePath
        coverImageProvider
        coverImageProviderUrl
      }
    }
    insertUserImageLogOne(
      object: {
        fileName: $coverImageFileName
        provider: $coverImageProvider
        providerId: $coverImageProviderId
        providerUrl: $coverImageProviderUrl
        userId: $id
        path: $coverImagePath
      }
    ) {
      id
    }
  }
`;
