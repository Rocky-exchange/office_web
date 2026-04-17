import { render, screen } from '@testing-library/react';

import HomePage from '@/components/home/home-page';

describe('homepage', () => {
  test('renders the hero headline and key sections in order', () => {
    render(<HomePage />);

    const headings = screen.getAllByRole('heading').filter((heading) => {
      const level = heading.tagName.toLowerCase();
      return level === 'h1' || level === 'h2';
    });
    const labels = headings.map((heading) => heading.textContent);

    expect(labels).toEqual([
      'PRIVATE POSITIONS. MINING TRADES. ALL IN POCKY.',
      'Three Moats Competitors Structurally Cannot Replicate.',
      'Every Trade You Make Produces POCKY.',
    ]);
  });

  test('renders navigation and cta anchors for the implemented sections only', () => {
    render(<HomePage />);

    const nav = screen.getByRole('navigation', { name: /primary/i });
    const navLinks = screen.getAllByRole('link').filter((link) => nav.contains(link));

    expect(navLinks).toHaveLength(2);
    expect(
      navLinks.map((link) => ({
        text: link.textContent,
        href: link.getAttribute('href'),
      })),
    ).toEqual([
      { text: 'Why Rocky', href: '#why-rocky' },
      { text: 'POCKY', href: '#trade' },
    ]);

    expect(
      screen.getByRole('link', { name: /start trading/i }),
    ).toHaveAttribute('href', '#trade');
    expect(
      screen.getByRole('link', { name: /study the model/i }),
    ).toHaveAttribute('href', '#why-rocky');
  });
});
