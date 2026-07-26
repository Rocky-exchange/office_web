import { validateOgApplication } from '@/lib/og-application-schema';

const validApplication = {
  xHandle: '@rocky_trader',
  email: 'Trader@Example.com',
  xPostUrl: 'https://x.com/rocky_trader/status/1234567890',
  walletPartyId: '  party::rocky-test  ',
  plannedInvitee1Handle: '@invitee_one',
  plannedInvitee1Type: 'Individual',
  plannedInvitee2Handle: '@project_two',
  plannedInvitee2Type: 'Project',
  experience:
    'I follow the Canton ecosystem and actively trade spot and perpetual markets.',
  consent: true,
};

describe('validateOgApplication', () => {
  test('normalizes and accepts a complete application', () => {
    const result = validateOgApplication(validApplication);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe('trader@example.com');
      expect(result.data.walletPartyId).toBe('party::rocky-test');
      expect(result.data.source).toBe('rocky-website');
    }
  });

  test('returns field errors for an incomplete application', () => {
    const result = validateOgApplication({
      ...validApplication,
      xHandle: 'not a valid handle',
      xPostUrl: 'https://example.com/not-an-x-post',
      plannedInvitee1Handle: '',
      plannedInvitee1Type: '',
      experience: '',
      consent: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toMatchObject({
        xHandle: expect.any(String),
        xPostUrl: expect.any(String),
        plannedInvitee1Handle: expect.any(String),
        plannedInvitee1Type: expect.any(String),
        experience: expect.any(String),
        consent: expect.any(String),
      });
    }
  });

  test('rejects submissions that fill the honeypot field', () => {
    const result = validateOgApplication({
      ...validApplication,
      website: 'https://spam.example',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.website).toBeDefined();
    }
  });
});
