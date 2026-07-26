export const OG_APPLICATION_STATUSES = [
  'pending',
  'reviewing',
  'approved',
  'declined',
] as const;

export type OgApplicationStatus = (typeof OG_APPLICATION_STATUSES)[number];

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

export type OgApplication = Omit<OgApplicationInput, 'consent' | 'website'> & {
  id: string;
  submittedAt: string;
  status: OgApplicationStatus;
  consent: 'yes';
};

export type OgApplicationValidation =
  | { ok: true; data: OgApplicationInput }
  | { ok: false; errors: Record<string, string> };

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isPublicXPostUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    return (
      url.protocol === 'https:' &&
      (hostname === 'x.com' || hostname === 'twitter.com') &&
      url.pathname.split('/').filter(Boolean).length >= 3
    );
  } catch {
    return false;
  }
}

export function validateOgApplication(
  value: unknown,
): OgApplicationValidation {
  const raw =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};

  const data: OgApplicationInput = {
    xHandle: cleanText(raw.xHandle, 50),
    email: cleanText(raw.email, 160).toLowerCase(),
    xPostUrl: cleanText(raw.xPostUrl, 300),
    walletPartyId: cleanText(raw.walletPartyId, 300),
    plannedInvitee1Handle: cleanText(raw.plannedInvitee1Handle, 50),
    plannedInvitee1Type: cleanText(raw.plannedInvitee1Type, 40),
    plannedInvitee2Handle: cleanText(raw.plannedInvitee2Handle, 50),
    plannedInvitee2Type: cleanText(raw.plannedInvitee2Type, 40),
    experience: cleanText(raw.experience, 1200),
    consent: raw.consent === true,
    website: cleanText(raw.website, 200),
    source: cleanText(raw.source, 120) || 'rocky-website',
  };

  const errors: Record<string, string> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const xHandlePattern = /^@?[A-Za-z0-9_]{1,15}$/;

  if (!xHandlePattern.test(data.xHandle)) {
    errors.xHandle = 'Enter a valid X handle.';
  }
  if (!emailPattern.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!isPublicXPostUrl(data.xPostUrl)) {
    errors.xPostUrl = 'Enter a direct link to your public X reply or quote post.';
  }
  if (!xHandlePattern.test(data.plannedInvitee1Handle)) {
    errors.plannedInvitee1Handle = 'Enter a valid X handle for Invitee #1.';
  }
  if (!data.plannedInvitee1Type) {
    errors.plannedInvitee1Type = 'Select a type for Invitee #1.';
  }
  if (
    data.plannedInvitee2Handle &&
    !xHandlePattern.test(data.plannedInvitee2Handle)
  ) {
    errors.plannedInvitee2Handle = 'Enter a valid X handle for Invitee #2.';
  }
  if (data.plannedInvitee2Handle && !data.plannedInvitee2Type) {
    errors.plannedInvitee2Type = 'Select a type for Invitee #2.';
  }
  if (!data.plannedInvitee2Handle && data.plannedInvitee2Type) {
    errors.plannedInvitee2Handle = 'Enter the X handle for Invitee #2.';
  }
  if (!data.experience) {
    errors.experience = 'Tell us about your Canton or trading experience.';
  }
  if (!data.consent) {
    errors.consent = 'Consent is required to submit the application.';
  }
  if (data.website) {
    errors.website = 'Unable to submit this application.';
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}
