import { fireEvent, render, screen } from '@testing-library/react';

import { OgContributionForm } from '@/components/og-access/og-contribution-form';

describe('OG contribution update', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as { fetch?: typeof fetch }).fetch;
  });

  test('keeps all invitee post fields optional', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reference_code: 'OG-APP-1234ABCD',
        email: 'applicant@example.com',
        contribution_deadline: '2099-01-01T00:00:00.000Z',
        window_open: true,
      }),
    } as Response);

    render(<OgContributionForm initialApplicationId="OG-APP-1234ABCD" />);

    fireEvent.change(screen.getByLabelText('APPLICATION EMAIL'), {
      target: { value: 'applicant@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByLabelText('APPLICANT POST #1'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('INVITEE #1 POST #1 (OPTIONAL)'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('INVITEE #2 POST #1 (OPTIONAL)'),
    ).toBeInTheDocument();
  });

  test('fills the application reference when the email is resolved', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reference_code: 'OG-APP-A1B2C3D4',
        email: 'applicant@example.com',
        contribution_deadline: '2099-01-01T00:00:00.000Z',
        window_open: true,
      }),
    } as Response);

    render(<OgContributionForm />);

    const email = screen.getByLabelText('APPLICATION EMAIL');
    fireEvent.change(email, {
      target: { value: 'applicant@example.com' },
    });
    fireEvent.blur(email);

    expect(
      await screen.findByDisplayValue('OG-APP-A1B2C3D4'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reference and email are linked/i),
    ).toBeInTheDocument();
  });
});
