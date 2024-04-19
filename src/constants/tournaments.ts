export const MAX_TRIPLES_TEAMS = 8;
export const READING_TOURNAMENT_SLUG = 'fromuth-fall-classic';
export const HONCHO_TOURNAMENT_SLUG = 'honcho-leagues';
export const DETROIT_TOURNAMENT_SLUG = 'detroit-court4';
export const TSU_TOURNAMENT_SLUG = 'tsu-tennis-courts';
export const MARYLAND_FARMS_TOURNAMENT_SLUG = 'maryland-farms';

export const DUPR_EXPLANATION = 'https://www.bounce.game/blog/dupr-explained';

export const ADDITIONAL_PLAYERS_COUNT = 0;

export type Tournament = {
  title: string;
  detailsEvents: string[];
  lat: number;
  long: number;
  id: number;
  airtableId: string;
  startDate: string;
  endDate: string;
  slug: string;
  group: string;
  region: string;
  season: string;
  division: string;
  tournamentDetailsId: string;
  format: string;
  facilityName: string;
  city: string;
  playAreaType: string;
  netType: string;
  surfaceType: string[];
  ball: string;
  courtsNumber: number;
  registrationCloses: string;
  registrationFee: number;
  events: string[];
  firstPlacePrize: string;
  finalistPrize: string;
  venueAddress: string;
  venueName: string;
  description: string;
  ogImageUrl: string;
  appImageUrl: string;
  sponsorImageUrl: string;
  membersCount: number;
  maxTeams: number;
  maxTeamsPerPool: number;
  filledTeamsPerGroup: number;
  brevoListId: number;
  participantsDescription: string;
  countdownDescription: string;
  formatDetails: string;
  faq: { title: string; description: string }[];
};

export type HonchoTournament = Pick<
  Tournament,
  | 'id'
  | 'airtableId'
  | 'title'
  | 'slug'
  | 'registrationFee'
  | 'description'
  | 'ogImageUrl'
  | 'appImageUrl'
> & {
  divisions: string[];
  sectionThreeHeader: string;
  sectionTwoHeader: string;
  registrationFeeValue: string;
  seasonDates: string;
  sectionOneBody: string;
  leagueDetails: string[];
  sectionTwoBody: string;
  registrationDeadline: string;
  differentiators: string;
  description: string;
  sectionOneHeader: string;
  perks: string[];
  perksList: string;
};

export type MultipleEventTeam = {
  id: number;
  registrantIds: number[];
  poolName: string;
  primaryEvents: string[];
  secondaryEvents: string[];
  firstNames: string[];
  emails: string[];
  lastNames: string[];
  genders: string[];
  primaryPartnerEmails: string[];
  secondaryPartnerEmails: string[];
  duprIds: string[];
  courtNames: string[];
  maxEventCount: number;
  tournamentName: string;
};

export type DuprInfo = {
  fullName: string;
  firstName: string;
  lastName: string;
  doubles?: number;
  singles?: number;
  duprId: string;
  age: number;
  address: string;
  gender: string;
};

export type ExternalTournament = Pick<
  Tournament,
  | 'id'
  | 'airtableId'
  | 'long'
  | 'lat'
  | 'title'
  | 'facilityName'
  | 'city'
  | 'courtsNumber'
  | 'slug'
  | 'description'
  | 'membersCount'
  | 'venueAddress'
  | 'maxTeams'
  | 'maxTeamsPerPool'
  | 'filledTeamsPerGroup'
  | 'registrationFee'
  | 'registrationCloses'
  | 'surfaceType'
  | 'playAreaType'
  | 'netType'
  | 'ball'
  | 'firstPlacePrize'
  | 'finalistPrize'
  | 'detailsEvents'
  | 'startDate'
  | 'brevoListId'
  | 'ogImageUrl'
> & {
  format: string[];
  eventSelection: string[];
  eventFee: number;
  registrationOpens: string;
  courtType: string;
  state: string;
  rating: string[];
  tournamentDate: string;
  registrationClosesValue: string;
};

export type TournamentPreview = {
  dates: string;
  bannerTextThirdEntry: string;
  location: string;
  active: string;
  airtableId: string;
  internalTournamentId: string;
  slug: string;
  format: string;
  rewards: string;
  events: string;
  registrationFee: string;
  registrationCloses: string;
  startDate: string;
  scheduleRelease: string;
  status: 'Active' | 'Concluded' | 'Closed';
  recap: string;
  isExternal: boolean;
};

export type Registrant = {
  id: number;
  playerAccountId: number;
  email: string;
  firstName: string;
  username: string;
  tournamentId: string;
  tournamentTitle: string;
  hasPartner: boolean;
  partnerEmail: string;
  stripeChargeId: string;
  gender: string;
  duprId: string;
  lastName: string;
  tournamentSlug: string;
  tournamentCity: string;
  tournamentFacilityName: string;
  endDate: string;
  startDate: string;
  brevoEmailDate: string;
  tournamentAddress: string;
  lastModified: string;
  poolTime: string;
  poolAssignment: string;
  teamId: number;
  firstNameOfteamMembers: string[];
  airtableId: string;
  isProduction: boolean;
};

export type ExternalRegistrant = Pick<
  Registrant,
  | 'id'
  | 'playerAccountId'
  | 'stripeChargeId'
  | 'gender'
  | 'duprId'
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'airtableId'
  | 'startDate'
  | 'tournamentFacilityName'
  | 'email'
  | 'tournamentTitle'
> & {
  created: string;
  primaryPartnerEmail: string;
  secondaryPartnerEmail: string;
  primaryEvent: string;
  secondaryEvent: string;
  tournamentAddress: string;
  teamIds: number[];
  poolAssignments: string[];
  isProduction: boolean;
};

export type HonchoRegistrant = Pick<
  Registrant,
  | 'id'
  | 'playerAccountId'
  | 'partnerEmail'
  | 'stripeChargeId'
  | 'gender'
  | 'duprId'
  | 'email'
  | 'firstName'
  | 'lastName'
>;

export type MappedPool = {
  name: string;
  poolTime: string;
  teams: Record<string, Registrant[]>;
};

export type PlayerAccount = {
  id: number;
  airtableId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bounceUserId: string;
  externalRegistrantIds: string[];
  registrantIds: string[];
  externalRegisterDuprId: string;
  registerDuprId: string;
  duprInfo: string;
};

export type RoundRobinMatch = {
  teamA: number;
  teamB: number;
  court: number;
  time: number;
};

export type Round = {
  matches: RoundRobinMatch[];
  byes: number[];
};

export type SchedulerConfig = {
  numTeams: number;
  numCourts: number;
  timePerMatch: number;
  totalTime?: number;
  minimumGamesPerTeam?: number;
  ensureEqualMatches?: boolean;
  shouldPlayAllTeamsExactlyOnce?: boolean;
  shouldPreventDuplicateMatches?: boolean;
};

export interface RunnerConfig extends SchedulerConfig {
  courts?: number[];
  teams: string[];
}
