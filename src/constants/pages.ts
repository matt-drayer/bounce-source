import {
  CalendarDaysIcon,
  QrCodeIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import Court from 'svg/Court';
import Group from 'svg/Group';
import Home from 'svg/Home';
import RacketBall from 'svg/RacketBall';
import RacketTwo from 'svg/RacketTwo';
import Trophy from 'svg/Trophy';
import NotificationIndicator from 'components/NotificationIndicator';

export const ROOT_PAGE = '/';
export const TOURNAMENT_ORGANIZER_DASHBOARD = '/tournaments-dashboard';
export const LANDING_PAGE = '/tour';
export const TOURNAMENT_MARKET_PLACE = ROOT_PAGE;
export const PLAY_PAGE = '/play';
export const HOME_PAGE = TOURNAMENT_MARKET_PLACE;
export const TEMP_COACH_HOME = '/home';
export const TRAIN_PAGE = '/train';
export const EXPLORE_PAGE = '/explore';
export const ABOUT_PAGE = '/about';
export const BLOG_PAGE = '/blog';
export const PRIVACY_PAGE = '/privacy';
export const TERMS_PAGE = '/terms';
export const TOURNAMENTS_PAGE = '/tournaments';
export const COURT_FINDER_PAGE = '/court-finder';
export const CITY_PAGE = '/city';
export const COUNTRY_PAGE = '/country';
export const COUNTRY_SUBDIVISION_PAGE = '/region';
export const COURT_PAGE = '/court';
export const EVENT_PAGE = '/event';
export const AUTH_SELECT_PAGE = '/auth';
export const HOSTED_TOURNAMENTS_PAGE = '/tournaments-hosted';
export const FORGOT_PASSWORD_PAGE = '/forgot-password';
export const LOGOUT_PAGE = '/logout';
export const LOGIN_PAGE = '/login';
export const SIGNUP_PAGE = '/signup';
export const SIGNUP_CODE_PAGE = '/signup-code';
export const CHAMPION_WAITLIST_PAGE = '/champion-waitlist';
export const CHAMPION_WAITLIST_SUCCESS_PAGE = '/champion-waitlist-success';
export const SIGNUP_COACH_PAGE = '/signup/coach';
export const SIGNUP_PLAYER_PAGE = '/signup/player';
export const ONBOARDING_ROOT = '/onboard';
export const ONBOARDING_COACH = `${ONBOARDING_ROOT}/coach`;
export const ONBOARDING_COACH_LOCATION_PAGE = `${ONBOARDING_COACH}/location`;
export const ONBOARDING_COACH_QUALIFICATIONS_PAGE = `${ONBOARDING_COACH}/qualifications`;
export const ONBOARDING_COACH_BIO_PAGE = `${ONBOARDING_COACH}/bio`;
export const ONBOARDING_COACH_LEGAL_PAGE = `${ONBOARDING_COACH}/legal`;
export const ONBOARDING_PLAYER = `${ONBOARDING_ROOT}/player`;
export const ONBOARDING_PLAYER_BIO_PAGE = `${ONBOARDING_PLAYER}/bio`;
export const ONBOARDING_PLAYER_LOCATION_PAGE = `${ONBOARDING_PLAYER}/location`;
export const ONBOARDING_PLAYER_FOLLOW_PAGE = `${ONBOARDING_PLAYER}/follow`;
export const ONBOARDING_PLAYER_LEGAL_PAGE = `${ONBOARDING_PLAYER}/legal`;
export const ONBOARDING_PLAYER_SKILL_LEVEL_PAGE = `${ONBOARDING_PLAYER}/skill`;
export const ONBOARDING_COMPLETE_PAGE = `${ONBOARDING_ROOT}/complete`;
export const PERSONAL_ROUTES_ROOT = '/my';
export const TEMPLATES_PAGE = `${PERSONAL_ROUTES_ROOT}/templates`; // OR SHOULD THIS JUST BE /templates?
export const QR_SHARE_PAGE = `${PERSONAL_ROUTES_ROOT}/share`; // OR SHOULD THIS JUST BE /share?
export const MY_CALENDAR_PAGE = `${PERSONAL_ROUTES_ROOT}/calendar`; // OR SHOULD THIS JUST BE /calendar or /lessons?
export const MY_LESSONS_PAGE = `${PERSONAL_ROUTES_ROOT}/lessons`; // OR SHOULD THIS JUST BE /calendar or /lessons?
export const MY_PLAYERS_PAGE = `${PERSONAL_ROUTES_ROOT}/followers`; // OR SHOULD THIS JUST BE /calendar or /lessons?
export const MY_PROFILE_PAGE = `${PERSONAL_ROUTES_ROOT}/profile`; // OR SHOULD THIS JUST BE /calendar or /lessons?
export const MY_COACHES_PAGE = `${PERSONAL_ROUTES_ROOT}/coaches`;
export const MY_SETTINGS_PAGE = `${PERSONAL_ROUTES_ROOT}/settings`;
export const MY_PERSONAL_INFO_PAGE = `${PERSONAL_ROUTES_ROOT}/personal-details`;
export const MY_PAYMENT_DETAILS_PAGE = `${PERSONAL_ROUTES_ROOT}/payment-details`;
export const MY_NOTIFICATION_SETTINGS_PAGE = `${PERSONAL_ROUTES_ROOT}/notification-settings`;
export const MY_CHANGE_PASSWORD_PAGE = `${PERSONAL_ROUTES_ROOT}/change-password`;
export const MY_GROUPS = `${PERSONAL_ROUTES_ROOT}/groups`; // IS THIS RIGHT? Current could just show their primary group but eventually list of their groups
export const MY_COMPETE = `${PERSONAL_ROUTES_ROOT}/compete`; // IS THIS RIGHT? Current could just show their primary group but eventually list of their groups
export const CONTACT_US = `/contact`;
export const MY_NOTIFICATIONS_PAGE = `${PERSONAL_ROUTES_ROOT}/notifications`;
export const STRIPE_ONBOARD_REFRESH = `${PERSONAL_ROUTES_ROOT}/stripe/connect/refresh`;
export const NEW_LESSON_PAGE = '/new-lesson';
export const NEW_PLAY_SESSION_PAGE = '/new-play';
export const PREVIEW_PAGE = '/preview';
export const LESSON_PUBLISHED_PAGE = '/published';
export const PLAY_SESSION_PUBLISHED_PAGE = '/published';
export const PLAY_SESSION_EDIT_EXISTING_PAGE = '/edit';
export const PLAY_SESSION_JOIN_PAGE = '/join';
export const PLAY_SESSION_JOIN_SUCCESS_PAGE = `${PLAY_SESSION_JOIN_PAGE}/success`;
export const LESSON_REPEAT_PAGE = '/repeat';
export const LESSON_JOIN_PAGE = '/join';
export const LESSON_JOIN_SUCCESS_PAGE = `${LESSON_JOIN_PAGE}/success`;
export const LESSON_JOIN_PAYMENT_FULFILLMENT_CHANNEL_PAGE = `${LESSON_JOIN_PAGE}/method`;
export const getNewLessonEditPageUrl = (lessonId: string) => `${NEW_LESSON_PAGE}/${lessonId}`;
export const getNewLessonPreviewPageUrl = (lessonId: string) =>
  `${NEW_LESSON_PAGE}/${lessonId}${PREVIEW_PAGE}`;
export const getLessonPublishedPageUrl = (lessonId: string) =>
  `${NEW_LESSON_PAGE}/${lessonId}${LESSON_PUBLISHED_PAGE}`;
export const getLessonRepeatUrl = (lessonId: string) =>
  `${NEW_LESSON_PAGE}/${lessonId}${LESSON_REPEAT_PAGE}`;
export const LESSONS_PAGE = '/lessons';
export const LESSON_EDIT_EXISTING_PAGE = '/edit';
export const getLessonPageUrl = (lessonId: string) => `${LESSONS_PAGE}/${lessonId}`;
export const getExistingLessonEditPageUrl = (lessonId: string) =>
  `${LESSONS_PAGE}/${lessonId}${LESSON_EDIT_EXISTING_PAGE}`;
export const getLessonJoinPageUrl = (lessonId: string) =>
  `${LESSONS_PAGE}/${lessonId}${LESSON_JOIN_PAGE}`;
export const getLessonJoinSuccessPageUrl = (lessonId: string) =>
  `${LESSONS_PAGE}/${lessonId}${LESSON_JOIN_SUCCESS_PAGE}`;
export const getLessonPaymentFulfillmentChannelPageUrl = (lessonId: string) =>
  `${LESSONS_PAGE}/${lessonId}${LESSON_JOIN_PAYMENT_FULFILLMENT_CHANNEL_PAGE}`;

export const getNewPlaySessionPreviewPageUrl = (playSessionId: string) =>
  `${NEW_PLAY_SESSION_PAGE}/${playSessionId}${PREVIEW_PAGE}`;
export const getNewPlaySessionEditPageUrl = (playSessionId: string) =>
  `${NEW_PLAY_SESSION_PAGE}/${playSessionId}`;
export const getExistingPlaySessionEditPageUrl = (playSessionId: string) =>
  `${PLAY_PAGE}/${playSessionId}${PLAY_SESSION_EDIT_EXISTING_PAGE}`;
export const getPlaySessionPageUrl = (playSessionId: string) => `${PLAY_PAGE}/${playSessionId}`;
export const getPlaySessionPublishedPageUrl = (playSessionId: string) =>
  `${NEW_PLAY_SESSION_PAGE}/${playSessionId}${PLAY_SESSION_PUBLISHED_PAGE}`;
export const getPlaySessionJoinSuccessPageUrl = (playSessionId: string) =>
  `${PLAY_PAGE}/${playSessionId}${PLAY_SESSION_JOIN_SUCCESS_PAGE}`;
export const getMyGroupMembersPageUrl = (groupId: string) => `${MY_GROUPS}/${groupId}/members`;
export const getMyGroupVenuesPageUrl = (groupId: string) => `${MY_GROUPS}/${groupId}/courts`;
export const getMyGroupThreadPageUrl = ({
  groupId,
  threadId,
}: {
  groupId: string;
  threadId: string;
}) => `${MY_GROUPS}/${groupId}/threads/${threadId}`;

export const getProfilePageUrl = (username?: string | null) => {
  return username ? `/${username}` : '';
};

export const getArticlePageUrl = (slug: string) => `${BLOG_PAGE}/${slug}`;

export const getCountryCourtsPageUrl = (slug: string) => `${COUNTRY_PAGE}/${slug}/courts`;
export const getCountrySubdivisionCourtsPageUrl = (slug: string) =>
  `${COUNTRY_SUBDIVISION_PAGE}/${slug}/courts`;
export const getCityCourtsPageUrl = (slug: string) => `${CITY_PAGE}/${slug}/courts`;
export const getCourtPageUrl = (slug: string) => `${COURT_PAGE}/${slug}`;

export const getEventUrl = (idOrSlug: string) => `${EVENT_PAGE}/${idOrSlug}`;

export const COACH_ONBOARDING_STEPS = [
  { name: 'Where you coach', url: ONBOARDING_COACH_LOCATION_PAGE },
  { name: 'Share your qualifications', url: ONBOARDING_COACH_QUALIFICATIONS_PAGE },
  { name: 'Tell us a little about yourself', url: ONBOARDING_COACH_BIO_PAGE },
  { name: 'Your data protection', url: ONBOARDING_COACH_LEGAL_PAGE },
];
export const PLAYER_ONBOARDING_STEPS = [
  { name: 'Tell us a little about yourself', url: ONBOARDING_PLAYER_BIO_PAGE },
  { name: 'Your skill level', url: ONBOARDING_PLAYER_SKILL_LEVEL_PAGE },
  // {name: '', url: ONBOARDING_PLAYER_LOCATION_PAGE},
  { name: 'Your data protection', url: ONBOARDING_PLAYER_LEGAL_PAGE },
  // { name: 'Follow your coaches', url: ONBOARDING_PLAYER_FOLLOW_PAGE },
];

export const COACH_TABS = [
  { Icon: CalendarDaysIcon, text: 'Lessons', href: TEMP_COACH_HOME },
  { Icon: UserGroupIcon, text: 'Players', href: MY_PLAYERS_PAGE },
  { Icon: QrCodeIcon, text: 'Share', href: QR_SHARE_PAGE },
  { Icon: NotificationIndicator, text: 'Notifications', href: MY_NOTIFICATIONS_PAGE },
  { Icon: UserCircleIcon, text: 'Profile', href: MY_PROFILE_PAGE },
];

export const PLAYER_TABS = [
  { Icon: Trophy, text: 'Compete', href: TOURNAMENT_MARKET_PLACE },
  { Icon: Court, text: 'Court Finder', href: COURT_FINDER_PAGE },
  { Icon: RacketBall, text: 'Play', href: PLAY_PAGE },
  // { Icon: Group, text: 'Group', href: MY_GROUPS },
  { Icon: NotificationIndicator, text: 'Notifications', href: MY_NOTIFICATIONS_PAGE },
  // { Icon: Home, text: 'Home', href: HOME_PAGE },
  // { Icon: RacketBall, text: 'Train', href: TRAIN_PAGE },
  // { Icon: UserCircleIcon, text: 'Profile', href: MY_PROFILE_PAGE },
];

export const PLAYER_WITH_COACH_TABS = [
  ...PLAYER_TABS.slice(0, Math.floor(PLAYER_TABS.length / 2)),
  { Icon: RacketTwo, text: 'Train', href: TRAIN_PAGE },
  ...PLAYER_TABS.slice(Math.floor(PLAYER_TABS.length / 2)),
];

export const COACH_SIDEBAR = [
  { href: TEMP_COACH_HOME, Icon: CalendarDaysIcon, text: 'Lessons' },
  { href: MY_PLAYERS_PAGE, Icon: UserGroupIcon, text: 'Players' },
  // { Icon: RacketBall, text: 'Play', href: PLAY_PAGE },
  { href: QR_SHARE_PAGE, Icon: QrCodeIcon, text: 'Share' },
  { href: MY_NOTIFICATIONS_PAGE, Icon: NotificationIndicator, text: 'Notifications' },
  // { href: MY_PROFILE_PAGE, Icon: UserCircleIcon, text: 'Profile' },
];

export const PLAYER_SIDEBAR = [
  { Icon: Trophy, text: 'Compete', href: TOURNAMENT_MARKET_PLACE },
  { Icon: Court, text: 'Court Finder', href: COURT_FINDER_PAGE },
  { Icon: RacketBall, text: 'Play', href: PLAY_PAGE },
  { Icon: NotificationIndicator, text: 'Notifications', href: MY_NOTIFICATIONS_PAGE },
  // { Icon: QrCodeIcon, text: 'Share', href: QR_SHARE_PAGE },
  // { Icon: Home, text: 'Home', href: HOME_PAGE },
  // { Icon: RacketBall, text: 'Train', href: TRAIN_PAGE },
  // { Icon: UserCircleIcon, text: 'Profile', href: MY_PROFILE_PAGE },
];

export const PLAYER_WITH_COACH_SIDEBAR = [
  ...PLAYER_SIDEBAR.slice(0, Math.floor(PLAYER_SIDEBAR.length / 2)),
  { Icon: RacketTwo, text: 'Train', href: TRAIN_PAGE },
  ...PLAYER_SIDEBAR.slice(Math.floor(PLAYER_SIDEBAR.length / 2)),
];

export const ACTIVE_COUNTRIES = [
  {
    id: 'USA',
    slug: 'us',
    displayNameOverride: 'The United States',
    hasSubdivisionImages: true,
  },
  {
    id: 'CAN',
    slug: 'ca',
  },
  // {
  //   id: 'MEX',
  //   slug: 'mx',
  // },
];
