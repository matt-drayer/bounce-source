export interface PostRequestPayload {
  providerCardId?: string;
  tournamentId: string;
  duprId?: string;
  birthday?: string;
  invitationId?: string;
  teamId?: string;
  groups: {
    groupId: string;
    partnerEmail?: string;
    partnerName?: string;
  }[];
}
