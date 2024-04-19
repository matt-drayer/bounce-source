import { gql } from '@apollo/client';

export const GET_USER_AVAIlABLE_LESSON_CONTENT = gql`
  query getUserAvailableLessonContent($id: uuid!) {
    usersByPk(id: $id) {
      id
      customCourts(orderBy: { createdAt: DESC }) {
        createdAt
        deletedAt
        fullAddress
        id
        title
      }
      lessonTemplates {
        coverImageUrl
        createdAt
        currency
        deletedAt
        description
        id
        originalLessonId
        participantLimit
        priceUnitAmount
        privacy
        templateName
        title
        type
        typeCustom
        updatedAt
        userId
        userCustomCourtId
        sport
      }
    }
  }
`;

export const INSERT_NEW_LESSON_WITH_NEW_COURT = gql`
  mutation insertNewLessonWithNewCourt(
    $title: String!
    $type: LessonTypesEnum!
    $typeCustom: String = ""
    $status: LessonStatusesEnum = PENDING
    $description: String!
    $startDateTime: timestamptz!
    $endDateTime: timestamptz!
    $ownerUserId: uuid!
    $participantLimit: Int!
    $paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum!
    $priceUnitAmount: Int!
    $privacy: LessonPrivacyEnum = PUBLIC
    $coverImageUrl: String = ""
    $usedTemplateId: uuid
    $lessonTimeData: [LessonTimesInsertInput!]!
    $customCourtData: UserCustomCourtsInsertInput!
    $lessonEquipment: [LessonEquipmentInsertInput!] = []
    $locale: String!
    $timezoneName: String!
    $timezoneAbbreviation: String!
    $timezoneOffsetMinutes: Int!
    $sport: SportsEnum!
  ) {
    insertLessonsOne(
      object: {
        title: $title
        sport: $sport
        type: $type
        typeCustom: $typeCustom
        status: $status
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        description: $description
        ownerUserId: $ownerUserId
        participantLimit: $participantLimit
        paymentFulfillmentChannel: $paymentFulfillmentChannel
        priceUnitAmount: $priceUnitAmount
        privacy: $privacy
        coverImageUrl: $coverImageUrl
        usedTemplateId: $usedTemplateId
        locale: $locale
        timezoneName: $timezoneName
        timezoneAbbreviation: $timezoneAbbreviation
        timezoneOffsetMinutes: $timezoneOffsetMinutes
        times: { data: $lessonTimeData }
        userCustomCourt: { data: $customCourtData }
        equipment: {
          data: $lessonEquipment
          onConflict: {
            constraint: lesson_equipment_lesson_id_equipment_option_id_key
            updateColumns: deletedAt
          }
        }
      }
    ) {
      ...lessonFields
    }
  }
`;

export const INSERT_NEW_LESSON_WITH_EXISTING_COURT = gql`
  mutation insertNewLessonWithExistingCourt(
    $title: String!
    $sport: SportsEnum!
    $type: LessonTypesEnum!
    $typeCustom: String = ""
    $status: LessonStatusesEnum = PENDING
    $description: String!
    $startDateTime: timestamptz!
    $endDateTime: timestamptz!
    $ownerUserId: uuid!
    $participantLimit: Int!
    $paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum!
    $priceUnitAmount: Int!
    $privacy: LessonPrivacyEnum = PUBLIC
    $coverImageUrl: String = ""
    $usedTemplateId: uuid
    $lessonTimeData: [LessonTimesInsertInput!]!
    $userCustomCourtId: uuid
    $lessonEquipment: [LessonEquipmentInsertInput!] = []
    $locale: String!
    $timezoneName: String!
    $timezoneAbbreviation: String!
    $timezoneOffsetMinutes: Int!
  ) {
    insertLessonsOne(
      object: {
        title: $title
        sport: $sport
        type: $type
        typeCustom: $typeCustom
        status: $status
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        description: $description
        ownerUserId: $ownerUserId
        participantLimit: $participantLimit
        paymentFulfillmentChannel: $paymentFulfillmentChannel
        priceUnitAmount: $priceUnitAmount
        privacy: $privacy
        coverImageUrl: $coverImageUrl
        usedTemplateId: $usedTemplateId
        locale: $locale
        timezoneName: $timezoneName
        timezoneAbbreviation: $timezoneAbbreviation
        timezoneOffsetMinutes: $timezoneOffsetMinutes
        times: { data: $lessonTimeData }
        userCustomCourtId: $userCustomCourtId
        equipment: {
          data: $lessonEquipment
          onConflict: {
            constraint: lesson_equipment_lesson_id_equipment_option_id_key
            updateColumns: deletedAt
          }
        }
      }
    ) {
      ...lessonFields
    }
  }
`;

export const INSERT_USER_CUSTOM_COURT = gql`
  mutation insertUserCustomCourt($customCourtData: UserCustomCourtsInsertInput!) {
    insertUserCustomCourtsOne(object: $customCourtData) {
      id
    }
  }
`;

export const UPDATE_LESSON_TIMES = gql`
  mutation updateLessonTimes($lessonId: uuid!, $lessonTimeData: [LessonTimesInsertInput!]!) {
    deleteLessonTimes(where: { lessonId: { _eq: $lessonId } }) {
      affectedRows
    }
    insertLessonTimes(objects: $lessonTimeData) {
      affectedRows
    }
  }
`;

export const UPDATE_LESSON_EQUIPMENT = gql`
  mutation updateLessonEquipment(
    $lessonId: uuid!
    $lessonEquipmentData: [LessonEquipmentInsertInput!] = []
  ) {
    deleteLessonEquipment(where: { lessonId: { _eq: $lessonId } }) {
      affectedRows
    }
    insertLessonEquipment(objects: $lessonEquipmentData) {
      affectedRows
    }
  }
`;

export const UPDATE_NEW_LESSON_BY_ID = gql`
  mutation updateNewLessonById(
    $lessonId: uuid!
    $title: String!
    $sport: SportsEnum!
    $type: LessonTypesEnum!
    $typeCustom: String = ""
    $status: LessonStatusesEnum = PENDING
    $description: String!
    $startDateTime: timestamptz!
    $endDateTime: timestamptz!
    $participantLimit: Int!
    $paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum!
    $priceUnitAmount: Int!
    $privacy: LessonPrivacyEnum = PUBLIC
    $coverImageUrl: String = ""
    $usedTemplateId: uuid
    $userCustomCourtId: uuid!
  ) {
    updateLessonsByPk(
      pkColumns: { id: $lessonId }
      _set: {
        title: $title
        sport: $sport
        type: $type
        typeCustom: $typeCustom
        status: $status
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        description: $description
        participantLimit: $participantLimit
        paymentFulfillmentChannel: $paymentFulfillmentChannel
        priceUnitAmount: $priceUnitAmount
        privacy: $privacy
        coverImageUrl: $coverImageUrl
        usedTemplateId: $usedTemplateId
        userCustomCourtId: $userCustomCourtId
      }
    ) {
      ...lessonFields
    }
  }
`;

export const UPDATE_EXISTING_LESSON_BY_ID = gql`
  mutation updateExistingLessonById(
    $lessonId: uuid!
    $title: String!
    $description: String!
    $sport: SportsEnum = TENNIS
    $paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum!
    $participantLimit: Int!
  ) {
    updateLessonsByPk(
      pkColumns: { id: $lessonId }
      _set: {
        title: $title
        description: $description
        sport: $sport
        paymentFulfillmentChannel: $paymentFulfillmentChannel
        participantLimit: $participantLimit
      }
    ) {
      ...lessonFields
    }
  }
`;

export const UPDATE_USER_DEFAULT_PAYMENT_CHANNEL = gql`
  mutation updateUserDefaultCoachPaymentFulfillmentChannel(
    $id: uuid!
    $defaultCoachPaymentFulfillmentChannel: PaymentFulfillmentChannelsEnum!
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: { defaultCoachPaymentFulfillmentChannel: $defaultCoachPaymentFulfillmentChannel }
    ) {
      defaultCoachPaymentFulfillmentChannel
      id
    }
  }
`;
