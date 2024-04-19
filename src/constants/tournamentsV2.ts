type Base = {
  id: number;
  airtableId: string;
};

type Venue = {
  bounceVenueId: string;
  name: string;
  address: string;
  indoorCourts: number;
  outdoorCourts: number;
  courtSurface: string;
  latitude: number;
  longitude: number;
  tournaments: string[];
  totalCourts: number;
  surfaceTypes: string[];
} & Base;

type Tournament = {
  title: string;
  venueId: string;
  startDate: string;
  endDate: string;
  events: string[];
  publicListing: string[];
  scoringFormat: string[];
  ratingScale: string[];
  registrationDeadline: string;
  registrationFee: number;
  eventFee: number;
  totalPlayers: number;
  refundPolicy: string;
  faq: {
    title: string;
    description: string;
  }[];
  images: string;
  sponsors: string;
  sanctioned: string;
  totalCourts: number;
  slug: string;
  format: string[];
  eventTypes: string[];
  tournamentContact: string;
  fee: string[];
  additionalInfo: 'show' | 'hide';
  description: string;
  prizes: {
    event: string;
    champions: string;
    finalists: string;
  }[];
} & Base;

type PlayerAccount = {
  bounceId: string;
  userName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: string;
  duprId: string;
  duprFullName: string;
  duprDoublesRating: number;
  duprSinglesRating: number;
  teams: string[];
  registrations: string[];
  phoneNumber: string;
  instagramHandle: string;
  shirtSize: string;
} & Base;

type Registration = {
  playerAccountId: string;
  tournamentId: string;
  primaryEvent: string[];
  primaryPartnerEmail: string;
  secondaryEvent: string;
  secondaryPartnerEmail: string;
  firstName: string;
  fullName: string;
  email: string;
  lastName: string;
} & Base;

type Team = {
  poolId: string[];
  player1Id: string[];
  player2Id: string[];
  registrations: string[];
  fullName: string[];
  teamName: string;
  matches: string[];
  matches2: string[];
  matches3: string[];
  matches4: string[];
  playerAccounts: string[];
  tournamentId: string;
  poolNames: string[];
  eventId: string[];
} & Base;

type TournamentEvent = {
  name: string;
  format: string[];
  doublesSingles: string[];
  minRating: number;
  maxRating: number;
  maximumTeams: number;
  minimumNumOfGames: number;
  tournamentId: string[];
  startTime: string;
  duration: number;
  endTime: string;
  totalCourts: number;
  proposedCourts: string;
  eventPrice: number;
} & Base;

type Pool = {
  teams: string;
  matches: string[];
  tournamentId: string;
  title: string;
  maximumTeams: number[];
  pool: string;
} & Base;

type Match = {
  format: string[];
  singlesDoubles: string[];
  poolId: string[];
  team1Id: string[];
  team2Id: string[];
  games: string[];
  teams: string[];
  teams2: string[];
} & Base;

type Game = {
  matchId: string[];
  gameNumber: number;
  team1Score: number;
  team2Score: number;
} & Base;
