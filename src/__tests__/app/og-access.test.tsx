import { fireEvent, render, screen } from '@testing-library/react';

import { OgApplicationForm } from '@/components/og-access/og-application-form';

describe('OG access application', () => {
  test('matches the Season 0 form questions and wallet guidance', () => {
    render(<OgApplicationForm />);

    expect(
      screen.getByRole('link', { name: /submit x contribution update/i }),
    ).toHaveAttribute('href', '/og-access/update');

    fireEvent.change(screen.getByLabelText('X HANDLE'), {
      target: { value: '@rocky_test' },
    });
    fireEvent.change(screen.getByLabelText('EMAIL'), {
      target: { value: 'test@rocky.example' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByLabelText('LINK TO YOUR X POST')).toBeInTheDocument();
    expect(screen.getByText('@Rocky_exchange')).toHaveAttribute(
      'href',
      'https://x.com/Rocky_exchange',
    );
    expect(
      screen.getByRole('link', { name: /create rocky wallet/i }),
    ).toHaveAttribute('href', 'https://extension.rocky.exchange/');
    expect(
      screen.getByLabelText('ROCKY WALLET PARTY ID (OPTIONAL)'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('LINK TO YOUR X POST'), {
      target: { value: 'https://x.com/test1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByLabelText('INVITEE #1 X HANDLE'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('INVITEE #2 X HANDLE'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/why are they a good fit/i),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('INVITEE #1 X HANDLE'), {
      target: { value: '@invitee_one' },
    });
    fireEvent.change(screen.getByLabelText('INVITEE #1 TYPE'), {
      target: { value: 'Individual' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByLabelText(
        'TELL US ABOUT YOUR EXPERIENCE WITH CANTON OR TRADING',
      ),
    ).toBeInTheDocument();
  });
});
