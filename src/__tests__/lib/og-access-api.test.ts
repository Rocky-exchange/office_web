import {
  resolveOgApplication,
  submitOgApplication,
  submitOgContribution,
} from '@/lib/og-access-api';

describe('OG access API client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  test('maps the application form to the wallet backend contract', async () => {
    const fetchMock = (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        reference_code: 'OG-APP-A1B2C3D4',
        status: 'submitted',
      }),
    } as Response);

    const result = await submitOgApplication({
      xHandle: '@applicant',
      email: 'applicant@example.com',
      xPostUrl: 'https://x.com/applicant/status/100',
      walletPartyId: 'party-id',
      plannedInvitee1Handle: '@invitee',
      plannedInvitee1Type: 'Individual',
      plannedInvitee2Handle: '',
      plannedInvitee2Type: '',
      experience: 'Canton trader.',
      consent: true,
    });

    expect(result.applicationId).toBe('OG-APP-A1B2C3D4');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-extension.rocky.exchange/v1/og-applications',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          x_handle: '@applicant',
          email: 'applicant@example.com',
          x_post_url: 'https://x.com/applicant/status/100',
          party_id: 'party-id',
          invitee_1_x_handle: '@invitee',
          invitee_1_type: 'Individual',
          invitee_2_x_handle: '',
          invitee_2_type: '',
          experience: 'Canton trader.',
          consent: true,
        }),
      }),
    );
  });

  test('resolves either identifier and maps contribution post fields', async () => {
    const fetchMock = (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          reference_code: 'OG-APP-A1B2C3D4',
          email: 'applicant@example.com',
          contribution_deadline: '2099-01-01T00:00:00.000Z',
          window_open: true,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          update_code: 'OG-UPD-11223344',
          reference_code: 'OG-APP-A1B2C3D4',
          status: 'recorded',
        }),
      } as Response);

    const resolution = await resolveOgApplication({
      email: 'Applicant@Example.com',
    });
    expect(resolution.applicationId).toBe('OG-APP-A1B2C3D4');
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      email: 'applicant@example.com',
    });

    const result = await submitOgContribution({
      applicationId: resolution.applicationId,
      email: resolution.email,
      applicantPost1: 'https://x.com/applicant/status/200',
      applicantPost2: '',
      invitee1Post1: '',
      invitee1Post2: '',
      invitee2Post1: '',
      invitee2Post2: '',
      consent: true,
    });

    expect(result.updateId).toBe('OG-UPD-11223344');
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      reference_code: 'OG-APP-A1B2C3D4',
      email: 'applicant@example.com',
      applicant_post_1: 'https://x.com/applicant/status/200',
      applicant_post_2: '',
      invitee_1_post_1: '',
      invitee_1_post_2: '',
      invitee_2_post_1: '',
      invitee_2_post_2: '',
      authenticity_confirmed: true,
    });
  });
});
