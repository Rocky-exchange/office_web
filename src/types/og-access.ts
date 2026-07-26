export type OgApplicationInput = {
  xHandle: string;
  email: string;
  xPostUrl: string;
  walletPartyId: string;
  plannedInvitee1Handle: string;
  plannedInvitee1Type: string;
  plannedInvitee2Handle: string;
  plannedInvitee2Type: string;
  experience: string;
  consent: boolean;
  website?: string;
  source?: string;
};

export type OgContributionInput = {
  applicationId: string;
  email: string;
  applicantPost1: string;
  applicantPost2: string;
  invitee1Post1: string;
  invitee1Post2: string;
  invitee2Post1: string;
  invitee2Post2: string;
  consent: boolean;
  website?: string;
  source?: string;
};
