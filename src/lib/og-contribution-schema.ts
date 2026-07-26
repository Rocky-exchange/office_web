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

export type OgContributionUpdate = Omit<
  OgContributionInput,
  'consent' | 'website'
> & {
  id: string;
  submittedAt: string;
  consent: 'yes';
};

export type OgContributionValidation =
  | { ok: true; data: OgContributionInput }
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

export function validateOgContribution(
  value: unknown,
): OgContributionValidation {
  const raw =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};

  const data: OgContributionInput = {
    applicationId: cleanText(raw.applicationId, 40).toUpperCase(),
    email: cleanText(raw.email, 160).toLowerCase(),
    applicantPost1: cleanText(raw.applicantPost1, 300),
    applicantPost2: cleanText(raw.applicantPost2, 300),
    invitee1Post1: cleanText(raw.invitee1Post1, 300),
    invitee1Post2: cleanText(raw.invitee1Post2, 300),
    invitee2Post1: cleanText(raw.invitee2Post1, 300),
    invitee2Post2: cleanText(raw.invitee2Post2, 300),
    consent: raw.consent === true,
    website: cleanText(raw.website, 200),
    source: cleanText(raw.source, 120) || 'rocky-website',
  };

  const errors: Record<string, string> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!/^OG-APP-[A-Z0-9]{8}$/.test(data.applicationId)) {
    errors.applicationId = 'Enter a valid OG application reference.';
  }
  if (!emailPattern.test(data.email)) {
    errors.email = 'Enter the email used in your OG application.';
  }
  if (!isPublicXPostUrl(data.applicantPost1)) {
    errors.applicantPost1 = 'Enter a direct link to your public X post.';
  }

  const optionalPostFields = [
    'applicantPost2',
    'invitee1Post1',
    'invitee1Post2',
    'invitee2Post1',
    'invitee2Post2',
  ] as const;

  optionalPostFields.forEach((field) => {
    if (data[field] && !isPublicXPostUrl(data[field])) {
      errors[field] = 'Enter a direct public X post link or leave this blank.';
    }
  });

  if (!data.consent) {
    errors.consent = 'Confirm that the submitted posts are public and authentic.';
  }
  if (data.website) {
    errors.website = 'Unable to submit this contribution update.';
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}
