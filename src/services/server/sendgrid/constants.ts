export interface BaseTransactionalParams {
  templateId: string;
  from: {
    email: string;
    name: string;
  };
  to: string;
  dynamicTemplateData?: { [key: string]: any };
}

export const LESSON_AVAILABLE_FOR_WAITLIST_ID = 'd-33781622ef2841028dd034613794ce19';
export const LESSON_PARTICIPANT_JOIN_ID = 'd-e6aabccec8ee4445bd20d7948dd8d20e';
export const LESSON_PARTICIPANT_LEFT_ID = 'd-7168aa6fab6b4c8e9a86d9a4e3571f19';
export const LESSON_COACH_CANCEL_ID = 'd-88ca6e4c271347e68fa8c0ffcd38c56c';
export const LESSON_START_REMINDER_ID = 'd-2ed892f7c8314457b214c58118a44d2a';
export const PLAY_SESSION_CANCELED_ID = 'd-d9757b2d5ce64641bd14a289b43b1543';
export const PLAY_SESSION_PARTICIPANT_JOIN_ID = 'd-052d8891ef5e4f5f81c809b1fe862349';
export const PLAY_SESSION_PARTICIPANT_LEFT_ID = 'd-d462b4a56bd24d3494cfab2557de438b';
export const PLAY_SESSION_START_REMINDER_ID = 'd-f0d98b6fb3344eb3ad2e4c796a1b9c94';
export const PLAY_SESSION_DETAILS_UPDATED_ID = 'd-a9b0efcf3f9f42d4a3ab71f8399661cf';
export const PLAY_SESSION_COMMENT_SUBMITTED_ID = 'd-684bbe61171147caa5ffc4706963360a';
export const GROUP_COMMENT_SUBMITTED_ID = 'd-d78875d5956b45ab83e6efd5fbd322d6';

export const DEFAULT_TRANSACTIONAL_FROM_EMAIL = 'team@bounce.game';
export const DEFAULT_TRANSACTIONAL_FROM_NAME = 'Bounce Team';
