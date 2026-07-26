import { fireEvent, render, screen } from '@testing-library/react';

import { OgContributionForm } from '@/components/og-access/og-contribution-form';

describe('OG contribution update', () => {
  test('keeps all invitee post fields optional', () => {
    render(<OgContributionForm initialApplicationId="OG-APP-1234ABCD" />);

    fireEvent.change(screen.getByLabelText('APPLICATION EMAIL'), {
      target: { value: 'applicant@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByLabelText('APPLICANT POST #1')).toBeInTheDocument();
    expect(
      screen.getByLabelText('INVITEE #1 POST #1 (OPTIONAL)'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('INVITEE #2 POST #1 (OPTIONAL)'),
    ).toBeInTheDocument();
  });
});
