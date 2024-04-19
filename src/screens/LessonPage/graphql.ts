import { gql } from '@apollo/client';

export const SET_LESSON_AS_ACTIVE = gql`
  mutation setLessonAsActive($id: uuid!) {
    updateLessonsByPk(pkColumns: { id: $id }, _set: { status: ACTIVE, publishedAt: "now()" }) {
      id
      status
      publishedAt
    }
  }
`;

export const INSERT_LESSON_TEMPLATE = gql`
  mutation insertLessonTemplate(
    $coverImageUrl: String = ""
    $currency: String!
    $description: String!
    $originalLessonId: uuid!
    $participantLimit: Int!
    $priceUnitAmount: Int!
    $privacy: LessonPrivacyEnum!
    $templateName: String!
    $title: String!
    $type: LessonTypesEnum!
    $typeCustom: String!
    $userId: uuid!
    $userCustomCourtId: uuid!
    $sport: SportsEnum!
  ) {
    insertLessonTemplatesOne(
      object: {
        coverImageUrl: $coverImageUrl
        currency: $currency
        description: $description
        originalLessonId: $originalLessonId
        participantLimit: $participantLimit
        priceUnitAmount: $priceUnitAmount
        privacy: $privacy
        templateName: $templateName
        title: $title
        type: $type
        typeCustom: $typeCustom
        userId: $userId
        userCustomCourtId: $userCustomCourtId
        sport: $sport
      }
    ) {
      id
      type
      title
      templateName
      coverImageUrl
      currency
      description
      originalLessonId
      participantLimit
      priceUnitAmount
      privacy
      templateName
      type
      typeCustom
      userId
      userCustomCourtId
      sport
    }
  }
`;

export const GET_LESSON_PARTICIPANT_ORDER_DETAILS = gql`
  query getLessonParticipantOrderDetails($userId: uuid!, $lessonId: uuid!) {
    lessonParticipants(where: { userId: { _eq: $userId }, lessonId: { _eq: $lessonId } }) {
      id
      userId
      lessonId
      status
      paymentFulfillmentChannel
      orderItems {
        id
        status
        totalUnitAmount
        order {
          paidUnitAmount
          refundUnitAmount
          status
          orderTotalUnitAmount
          orderSubtotalUnitAmount
        }
        priceUnitAmount
      }
    }
  }
`;

export const GET_LESSON_WAITLIST = gql`
  query getLessonWaitlist($lessonId: uuid!) {
    lessonWaitlists(where: { lessonId: { _eq: $lessonId }, status: { _eq: ACTIVE } }) {
      id
      status
      userId
      userProfile {
        id
        fullName
        profileImageFileName
        profileImagePath
        profileImageProviderUrl
        username
      }
    }
  }
`;

export const UPSERT_LESSON_WAITLIST = gql`
  mutation upsertLessonWaitlist(
    $userId: uuid!
    $lessonId: uuid!
    $status: LessonWaitlistStatusesEnum!
  ) {
    insertLessonWaitlistsOne(
      object: { userId: $userId, lessonId: $lessonId, status: $status }
      onConflict: { constraint: lesson_waitlists_user_id_lesson_id_key, updateColumns: status }
    ) {
      lessonId
      status
      userId
      id
    }
  }
`;
