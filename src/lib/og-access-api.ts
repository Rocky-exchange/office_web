import type {
  OgApplicationInput,
  OgContributionInput,
} from '@/types/og-access';

const DEFAULT_API_BASE_URL = 'https://api-extension.rocky.exchange';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_ROCKY_WALLET_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

type BackendError = {
  error?: string;
};

export type OgApplicationResolution = {
  applicationId: string;
  email: string;
  contributionDeadline: string;
  windowOpen: boolean;
};

export class OgAccessApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OgAccessApiError';
    this.status = status;
  }
}

async function requestJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let result: T & BackendError;
  try {
    result = (await response.json()) as T & BackendError;
  } catch {
    throw new OgAccessApiError(
      'The OG access service returned an invalid response.',
      response.status,
    );
  }

  if (!response.ok) {
    throw new OgAccessApiError(
      result.error || 'The OG access service is temporarily unavailable.',
      response.status,
    );
  }

  return result;
}

export async function submitOgApplication(input: OgApplicationInput) {
  const result = await requestJson<{
    reference_code: string;
    status: string;
  }>('/v1/og-applications', {
    x_handle: input.xHandle,
    email: input.email,
    x_post_url: input.xPostUrl,
    party_id: input.walletPartyId,
    invitee_1_x_handle: input.plannedInvitee1Handle,
    invitee_1_type: input.plannedInvitee1Type,
    invitee_2_x_handle: input.plannedInvitee2Handle,
    invitee_2_type: input.plannedInvitee2Type,
    experience: input.experience,
    consent: input.consent,
  });

  return {
    applicationId: result.reference_code,
    submittedAt: new Date().toISOString(),
  };
}

export async function resolveOgApplication(input: {
  applicationId?: string;
  email?: string;
}): Promise<OgApplicationResolution> {
  const result = await requestJson<{
    reference_code: string;
    email: string;
    contribution_deadline: string;
    window_open: boolean;
  }>('/v1/og-contributions/resolve', {
    ...(input.applicationId
      ? { reference_code: input.applicationId.trim().toUpperCase() }
      : {}),
    ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
  });

  return {
    applicationId: result.reference_code,
    email: result.email,
    contributionDeadline: result.contribution_deadline,
    windowOpen: result.window_open,
  };
}

export async function submitOgContribution(input: OgContributionInput) {
  const result = await requestJson<{
    update_code: string;
    reference_code: string;
    status: string;
  }>('/v1/og-contributions', {
    reference_code: input.applicationId,
    email: input.email,
    applicant_post_1: input.applicantPost1,
    applicant_post_2: input.applicantPost2,
    invitee_1_post_1: input.invitee1Post1,
    invitee_1_post_2: input.invitee1Post2,
    invitee_2_post_1: input.invitee2Post1,
    invitee_2_post_2: input.invitee2Post2,
    authenticity_confirmed: input.consent,
  });

  return {
    updateId: result.update_code,
    applicationId: result.reference_code,
  };
}
