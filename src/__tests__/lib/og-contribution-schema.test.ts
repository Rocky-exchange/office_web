import { validateOgContribution } from '@/lib/og-contribution-schema';

const validUpdate = {
  applicationId: 'og-app-1234abcd',
  email: 'Applicant@Example.com',
  applicantPost1: 'https://x.com/applicant/status/1234567890',
  applicantPost2: '',
  invitee1Post1: '',
  invitee1Post2: '',
  invitee2Post1: '',
  invitee2Post2: '',
  consent: true,
};

describe('validateOgContribution', () => {
  test('requires only the first applicant post', () => {
    const result = validateOgContribution(validUpdate);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.applicationId).toBe('OG-APP-1234ABCD');
      expect(result.data.email).toBe('applicant@example.com');
      expect(result.data.invitee1Post1).toBe('');
    }
  });

  test('validates optional links only when provided', () => {
    const result = validateOgContribution({
      ...validUpdate,
      applicantPost1: '',
      invitee1Post1: 'not-a-post',
      consent: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toMatchObject({
        applicantPost1: expect.any(String),
        invitee1Post1: expect.any(String),
        consent: expect.any(String),
      });
    }
  });
});
