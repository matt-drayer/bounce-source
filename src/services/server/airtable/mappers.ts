import { Match } from 'constants/dupr';
import {
  DuprInfo,
  ExternalRegistrant,
  ExternalTournament,
  HonchoTournament,
  MultipleEventTeam,
  PlayerAccount,
  Registrant,
  Tournament,
  TournamentPreview,
} from 'constants/tournaments';
import { baseTournamentToModel } from 'services/server/airtable/edge-mappers';
import { convertToNextObj } from 'utils/shared/objects';

export const tournamentToModel = (tournament: Record<string, any>): Tournament => {
  return convertToNextObj<Tournament>(baseTournamentToModel(tournament));
};

export const tournamentPreviewToModel = (preview: Record<string, any>): TournamentPreview => {
  return convertToNextObj<TournamentPreview>({
    dates: preview['Tournament Dates'],
    bannerTextThirdEntry: preview['Banner Text Third Entry'],
    location: preview['Location'],
    active: preview['Active'],
    airtableId: preview['id'],
    internalTournamentId: preview['Internal Tournament ID']?.[0],
    slug: preview['Slug'],
    format: preview['Format'],
    rewards: preview['Rewards'],
    events: preview['Events'],
    registrationFee: preview['Registration Fee'],
    registrationCloses: preview['Registration Closes'],
    startDate: preview['Start Date'],
    scheduleRelease: preview['Schedule Release'],
    status: preview['Status'],
    recap: preview['Recap'],
    isExternal: preview['Is External'],
  });
};

export const registrantToModel = (registrant: Record<string, any>): Registrant => {
  return convertToNextObj<Registrant>({
    id: registrant.ID,
    airtableId: registrant.id,
    poolTime: registrant['Pool Times (from Teams)']?.[0],
    poolAssignment: registrant['Pool Assignment (from Teams)']?.[0],
    playerAccountId: registrant['Registrant_ID'][0],
    teamId: registrant['ID (from Teams)']?.[0],
    email: registrant['Email (from Registrant)'][0],
    firstName: registrant['First Name (from Registrant)'][0],
    username: registrant['Username (from Registrant)'][0],
    tournamentId: registrant['Tournaments'][0],
    tournamentTitle: registrant['Title (from Tournaments)'][0],
    hasPartner: registrant.Partner,
    partnerEmail: registrant['Partner Email'],
    stripeChargeId: registrant['Stripe charge id'],
    gender: registrant.Gender,
    duprId: registrant['DUPR ID'],
    lastName: registrant['Last Name (from Registrant_ID)'][0],
    tournamentSlug: registrant['Slug (from Tournaments)'][0],
    tournamentCity: registrant['City (from Facilities/Courts_ID) (from Tournaments)'][0],
    tournamentFacilityName: registrant['Name (from Facilities/Courts) (from Tournaments)'][0],
    endDate: registrant['End Date (from Tournaments)'][0],
    startDate: registrant['Start Date (from Tournaments)'][0],
    brevoEmailDate: registrant['Brevo Email Date'],
    tournamentAddress: registrant['Address (from Facilities/Courts_ID) (from Tournaments)'][0],
    lastModified: registrant['Last Modified'],
    firstNameOfteamMembers: registrant['First Name of Team Members (from Teams)'],
    isProduction: registrant['IS PRODUCTION'],
  });
};

export const externalRegistrantToModel = (registrant: Record<string, any>): ExternalRegistrant => {
  return convertToNextObj<ExternalRegistrant>({
    airtableId: registrant.id,
    id: registrant.ID,
    playerAccountId: registrant['Account_ID'][0],
    stripeChargeId: registrant['Stripe charge id'],
    gender: registrant.Gender,
    duprId: registrant['DUPR ID'],
    tournamentTitle: registrant['Title (from Tournaments)'][0],
    firstName: registrant['First Name (from Registrant)'][0],
    username: registrant['Username (from Registrant)'][0],
    lastName: registrant['Last Name (from Account_ID)'][0],
    startDate: registrant['Tournament Date (from Tournaments)'][0],
    tournamentFacilityName: registrant['Name (from Facilities/Courts) (from Tournaments)'][0],
    email: registrant['Email (from Registrant)'][0],

    created: registrant.Created,
    primaryPartnerEmail: registrant['Primary Partner Email'],
    secondaryPartnerEmail: registrant['Secondary Partner Email'],
    primaryEvent: registrant['Primary Event'],
    secondaryEvent: registrant['Secondary Event'],
    tournamentAddress: registrant['Address (from Facilities/Courts_ID) (from Tournaments)'][0],
    teamIds: registrant['Team IDs'] || [],
    poolAssignments: registrant['Pool Assignments'] || [],
    isProduction: registrant['IS PRODUCTION'],
  });
};

export const honchoRegistrantToModel = (registrant: Record<string, any>): ExternalRegistrant => {
  return convertToNextObj<ExternalRegistrant>({
    id: registrant.ID,
    airtableId: registrant.id,
    playerAccountId: registrant['Account_ID'][0],
    partnerEmail: registrant['Partner Email'],
    stripeChargeId: registrant['Stripe charge id'],
    gender: registrant['Gender (from Account_ID)'][0],
    duprId: registrant['DUPR ID'],
    email: registrant['Email (from Account_ID)'][0],
    firstName: registrant['First Name (from Account_ID)'][0],
    lastName: registrant['Last Name (from Account_ID)'][0],
  });
};

export const externalTournamentToModel = (tournament: Record<string, any>): ExternalTournament => {
  return convertToNextObj<ExternalTournament>({
    id: tournament.ID,
    airtableId: tournament.id,
    long: tournament.Long[0],
    lat: tournament.Lat[0],
    tournamentDate: tournament['Tournament Date'],
    title: tournament.Title,
    format: tournament.Format.split('--'),
    facilityName: tournament['Name (from Facilities/Courts)'],
    city: tournament['City (from Facilities/Courts_ID)'],
    courtsNumber: tournament['# of Courts (from Facilities/Courts_ID)'][0],
    slug: tournament.Slug,
    description: tournament.Description,
    membersCount: tournament['Members count'],
    eventSelection: tournament['Event Selection'], // array,
    venueAddress: tournament['Address (from Facilities/Courts_ID)'][0],
    maxTeamsPerPool: tournament['Max teams per pool'],
    filledTeamsPerGroup: tournament['Filled Teams per group'],
    maxTeams: tournament['Max Teams'],
    registrationFee: tournament['Registration Fee'],
    eventFee: tournament['Event Fee'],
    registrationCloses: tournament['Registration Deadline'],
    surfaceType: tournament['Surface Type (from Facilities/Courts_ID)'],
    playAreaType: tournament['Play Area Type (from Facilities/Courts_ID)'][0],
    netType: tournament['Net Type (from Facilities/Courts_ID)'][0],
    ball: tournament.Ball,
    registrationOpens: tournament['Registration Opens'],
    firstPlacePrize: tournament['First Place Prize'],
    finalistPrize: tournament['Finalist Prize'],
    detailsEvents: tournament['Events'],
    courtType: tournament['Court Type (from Facilities/Courts_ID)'],
    startDate: tournament['Tournament Start Date'],
    state: tournament['State (from Facilities/Courts_ID)'][0],
    rating: tournament['Rating'],
    brevoListId: tournament['Brevo list id'],
    registrationClosesValue: tournament['Registration Deadline Value'],
    ogImageUrl: tournament.ogImageUrl
  });
};

export const honchoLeagueToModel = (honcho: Record<string, any>): HonchoTournament => {
  return convertToNextObj<HonchoTournament>({
    id: honcho.ID,
    airtableId: honcho.id,
    title: honcho.Title,
    slug: honcho.Slug,
    registrationFee: honcho['Registration Fee'],
    divisions: honcho.Divisions.split(', '),
    sectionThreeHeader: honcho['Section Three Header'],
    sectionTwoHeader: honcho['Section Two Header'],
    registrationFeeValue: honcho['Registration Fee Value'],
    seasonDates: honcho['Season Dates'],
    sectionOneBody: honcho['Section One Body'],
    leagueDetails: honcho['League Details'].split(', '),
    sectionTwoBody: honcho['Section Two Body'],
    registrationDeadline: honcho['Registration Deadline'],
    differentiators: honcho.Differentiators,
    description: honcho.Description,
    sectionOneHeader: honcho['Section One Header'],
    perks: honcho['Honcho Perks'].split(', '),
    perksList: honcho['Perks'],
  });
};

export const multipleEventTeamToModel = (team: Record<string, any>): MultipleEventTeam => {
  return convertToNextObj<MultipleEventTeam>({
    id: team['Team ID'],
    courtNames: team['Name (from Facilities/Courts) (from Tournaments) (from Registrant ID)'],
    duprIds: team['DUPR ID (from Registrant ID)'],
    secondaryPartnerEmails: team['Secondary Partner Email (from Registrant ID)'],
    secondaryEvents: team['Secondary Event (from Registrant ID)'],
    primaryPartnerEmails: team['Primary Partner Email (from Registrant ID)'],
    primaryEvents: team['Primary Event (from Registrant ID)'],
    genders: team['Gender (from Registrant ID)'],
    firstNames: team['First Name (from Registrant) (from Registrant ID)'],
    lastNames: team['Last Name (from Account_ID) (from Registrant ID)'],
    emails: team['Email (from Registrant) (from Registrant ID)'],
    registrantIds: team['ID (from Registrant ID)'],
    poolName: team.Pool,
    maxEventCount: team['Max Event Count'],
    tournamentName: team['Tournament Name'][0],
  });
};

export const duprInfoToModel = (item: Record<string, any>): DuprInfo => {
  return convertToNextObj<DuprInfo>({
    fullName: item['Full Name'],
    firstName: item['First Name'],
    lastName: item['Last Name'],
    doubles: item['Doubles'],
    singles: item['Singles'],
    duprId: item['DUPR ID'],
  });
};

export const matchToModel = (item: Record<string, any>): Match => {
  return convertToNextObj<Match>({
    id: item.ID,
    bracket: item.Bracket,
    clubId: +item['Club id'],
    event: item.Event,
    format: item.Format,
    identifier: item.Identifier,
    location: item.Location,
    matchDate: item['Match date'],
    matchSource: item.Source,
    matchType: item.Type,
    teams: JSON.parse(item.Teams),
  });
};

export const playerAccountToModel = (item: Record<string, any>): PlayerAccount => {
  return convertToNextObj<PlayerAccount>({
    airtableId: item.id,
    id: item.ID,
    firstName: item['First Name'],
    lastName: item['Last Name'],
    email: item.Email,
    username: item.Username,
    bounceUserId: item['Bounce user id'],
    externalRegistrantIds: item['External Registrant IDs'],
    registrantIds: item['Registrant IDs'],
    externalRegisterDuprId: item?.['External Register DUPR ID']?.[0],
    registerDuprId: item?.['Register DUPR ID']?.[0],
    duprInfo: item?.['DUPR INFO']?.[0],
  });
};
