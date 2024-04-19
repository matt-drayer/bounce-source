import { gql } from '@apollo/client';

export const GET_USER_GROUPS = gql`
  query getUserGroups($id: uuid!) {
    usersByPk(id: $id) {
      id
      groups(where: { isActive: { _eq: true } }) {
        id
        isActive
        groupId
      }
    }
  }
`;

export const GET_GROUP_BY_ID = gql`
  query getGroupById($id: uuid!, $userId: uuid!) {
    groupsByPk(id: $id) {
      contactEmail
      contactMessage
      contactPhoneNumber
      contactUrl
      coverPhotoUrl
      createdAt
      description
      displayOwnerContactInfo
      headline
      id
      isPrivate
      ownerUserId
      profilePhotoUrl
      skillLevelMaximum
      skillLevelMinimum
      slug
      title
      allowMemberInvites
      allowMemberSessionInvites
      accessCode
      city {
        id
        name
      }
      threads(orderBy: { createdAt: DESC }, limit: 50) {
        createdAt
        id
        comments(orderBy: { createdAt: ASC }, limit: 1) {
          createdAt
          content
          groupCommentId
          groupRootCommentId
          groupThreadId
          id
          isOriginalThreadComment
          votesAggregate(where: { vote: { _eq: POSITIVE } }) {
            aggregate {
              count
            }
          }
          userProfile {
            id
            fullName
            preferredName
            profileImagePath
            username
            defaultSport
          }
          votes(where: { userId: { _eq: $userId } }) {
            id
            userId
            groupThreadCommentId
            vote
          }
          files {
            id
            url
            path
          }
        }
        commentsAggregate {
          aggregate {
            count
          }
        }
      }
      membersAggregate {
        aggregate {
          count
        }
      }
      ownerUserProfile {
        id
        fullName
        profileImagePath
      }
      venuesAggregate(where: { venue: { isActive: { _eq: true } } }) {
        aggregate {
          count
        }
      }
    }
  }
`;

export const INSERT_THREAD_WITHCOMMENT = gql`
  mutation insertThreadWithComment(
    $groupId: uuid!
    $userId: uuid!
    $content: String = ""
    $files: [GroupThreadCommentFilesInsertInput!] = []
  ) {
    insertGroupThreadsOne(
      object: {
        groupId: $groupId
        userId: $userId
        comments: {
          data: {
            userId: $userId
            votes: { data: { vote: POSITIVE, userId: $userId } }
            isOriginalThreadComment: true
            content: $content
            files: { data: $files }
          }
        }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_COMMENT_FILE_AS_DELETED_AS_DELETED = gql`
  mutation updateCommentFileAsDeleted($id: uuid!) {
    updateGroupThreadCommentFilesByPk(pkColumns: { id: $id }, _set: { deletedAt: "now()" }) {
      id
      deletedAt
    }
  }
`;
