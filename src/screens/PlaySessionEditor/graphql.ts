import { gql } from '@apollo/client';

export const GET_USER_CUSTOM_COURTS = gql`
  query getUserCustomCourts($id: uuid!) {
    usersByPk(id: $id) {
      id
      customCourts(orderBy: { createdAt: DESC }) {
        createdAt
        deletedAt
        fullAddress
        id
        title
      }
    }
  }
`;

export const INSERT_NEW_PLAY_SESSION = gql`
  mutation insertNewPlaySession(
    $competitiveness: PlaySessionMatchCompetitivenessEnum!
    $courtBookingStatus: PlaySessionCourtBookingStatusesEnum!
    $description: String = ""
    $endDateTime: timestamptz!
    $extraRacketCount: Int = null
    $format: PlaySessionFormatsEnum!
    $isBringingNet: Boolean = false
    $locale: String!
    $organizerUserId: uuid!
    $participantLimit: Int = null
    $sport: SportsEnum!
    $startDateTime: timestamptz!
    $status: PlaySessionStatusesEnum = PENDING
    $targetSkillLevel: String
    $timezoneAbbreviation: String!
    $timezoneName: String!
    $timezoneOffsetMinutes: Int!
    $title: String = ""
    $userCustomCourtId: uuid
    $tennisRatingScaleId: uuid = null
    $pickleballRatingScaleId: uuid = null
    $privacy: PlaySessionPrivacyEnum = PRIVATE
    $skillRatingMaximum: numeric = null
    $skillRatingMinimum: numeric = null
    $groupId: uuid = null
    $venueId: uuid = null
    $commentData: [PlaySessionCommentsInsertInput!] = []
    $data: [GroupsPlaySessionsInsertInput!] = []
  ) {
    insertPlaySessionsOne(
      object: {
        competitiveness: $competitiveness
        courtBookingStatus: $courtBookingStatus
        description: $description
        endDateTime: $endDateTime
        extraRacketCount: $extraRacketCount
        format: $format
        isBringingNet: $isBringingNet
        locale: $locale
        organizerUserId: $organizerUserId
        participantLimit: $participantLimit
        sport: $sport
        startDateTime: $startDateTime
        status: $status
        targetSkillLevel: $targetSkillLevel
        timezoneAbbreviation: $timezoneAbbreviation
        timezoneName: $timezoneName
        timezoneOffsetMinutes: $timezoneOffsetMinutes
        title: $title
        userCustomCourtId: $userCustomCourtId
        tennisRatingScaleId: $tennisRatingScaleId
        pickleballRatingScaleId: $pickleballRatingScaleId
        privacy: $privacy
        skillRatingMaximum: $skillRatingMaximum
        skillRatingMinimum: $skillRatingMinimum
        comments: { data: $commentData }
        groupId: $groupId
        venueId: $venueId
        groupsPlaySessions: { data: $data }
        participants: {
          data: {
            addedByPersona: PLAYER
            addedAt: "now()"
            status: ACTIVE
            addedByUserId: $organizerUserId
            userId: $organizerUserId
          }
        }
      }
    ) {
      ...playSessionFields
    }
  }
`;

export const UPDATE_NEW_PLAY_SESSION_BY_ID = gql`
  mutation updateNewPlaySessionById(
    $playSessionId: uuid!
    $competitiveness: PlaySessionMatchCompetitivenessEnum!
    $courtBookingStatus: PlaySessionCourtBookingStatusesEnum!
    $description: String = ""
    $endDateTime: timestamptz!
    $extraRacketCount: Int = null
    $format: PlaySessionFormatsEnum!
    $isBringingNet: Boolean = false
    $participantLimit: Int = null
    $sport: SportsEnum!
    $startDateTime: timestamptz!
    $status: PlaySessionStatusesEnum = PENDING
    $targetSkillLevel: String
    $title: String = ""
    $userCustomCourtId: uuid
    $tennisRatingScaleId: uuid
    $pickleballRatingScaleId: uuid
    $skillRatingMaximum: numeric
    $skillRatingMinimum: numeric
    $privacy: PlaySessionPrivacyEnum = PRIVATE
    $venueId: uuid = null
    $commentObjects: [PlaySessionCommentsInsertInput!] = []
  ) {
    updatePlaySessionComments(
      where: { playSessionId: { _eq: $playSessionId } }
      _set: { deletedAt: "now()" }
    ) {
      affectedRows
    }
    updatePlaySessionsByPk(
      pkColumns: { id: $playSessionId }
      _set: {
        competitiveness: $competitiveness
        courtBookingStatus: $courtBookingStatus
        description: $description
        endDateTime: $endDateTime
        extraRacketCount: $extraRacketCount
        format: $format
        isBringingNet: $isBringingNet
        participantLimit: $participantLimit
        sport: $sport
        startDateTime: $startDateTime
        status: $status
        targetSkillLevel: $targetSkillLevel
        title: $title
        userCustomCourtId: $userCustomCourtId
        tennisRatingScaleId: $tennisRatingScaleId
        pickleballRatingScaleId: $pickleballRatingScaleId
        skillRatingMaximum: $skillRatingMaximum
        skillRatingMinimum: $skillRatingMinimum
        privacy: $privacy
        venueId: $venueId
      }
    ) {
      ...playSessionFields
    }
    insertPlaySessionComments(objects: $commentObjects) {
      affectedRows
    }
  }
`;

export const UPDATE_EXISTING_PLAY_SESSION_BY_ID = gql`
  mutation updateExistingPlaySessionById(
    $playSessionId: uuid!
    $title: String!
    $description: String!
    $sport: SportsEnum!
    $format: PlaySessionFormatsEnum!
    $targetSkillLevel: String
    $courtBookingStatus: PlaySessionCourtBookingStatusesEnum!
    $competitiveness: PlaySessionMatchCompetitivenessEnum!
    $extraRacketCount: Int = 0
    $isBringingNet: Boolean = false
    $participantLimit: Int = null
    $pickleballRatingScaleId: uuid
    $privacy: PlaySessionPrivacyEnum = PRIVATE
    $skillRatingMaximum: numeric
    $skillRatingMinimum: numeric
    $startDateTime: timestamptz!
    $endDateTime: timestamptz!
    $tennisRatingScaleId: uuid
    $venueId: uuid = null
  ) {
    updatePlaySessionsByPk(
      pkColumns: { id: $playSessionId }
      _set: {
        title: $title
        description: $description
        sport: $sport
        format: $format
        targetSkillLevel: $targetSkillLevel
        courtBookingStatus: $courtBookingStatus
        competitiveness: $competitiveness
        extraRacketCount: $extraRacketCount
        isBringingNet: $isBringingNet
        participantLimit: $participantLimit
        pickleballRatingScaleId: $pickleballRatingScaleId
        privacy: $privacy
        skillRatingMaximum: $skillRatingMaximum
        skillRatingMinimum: $skillRatingMinimum
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        tennisRatingScaleId: $tennisRatingScaleId
        venueId: $venueId
      }
    ) {
      ...playSessionFields
    }
  }
`;
