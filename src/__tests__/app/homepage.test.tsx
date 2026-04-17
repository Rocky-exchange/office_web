import { render, screen } from '@testing-library/react';

import HomePage from '@/components/home/home-page';
import {
  faqItems,
  mechanismSteps,
  tokenomicsAllocations,
} from '@/content/homepage';
import { homepageUrl, siteMetadata, sitemapUrl } from '@/lib/metadata';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

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
      'Trading Is Mining. Holding Is Discount. Loop Closes.',
      '1 Billion POCKY. Fixed Supply. Half To Users.',
      'Frequently Asked Questions',
      'SEALED IN CANTON. FORGED IN ROCKY.',
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
      { text: 'POCKY', href: '#pocky' },
    ]);

    expect(
      screen.getByRole('link', { name: /start trading/i }),
    ).toHaveAttribute('href', '#trade');
    expect(
      screen.getByRole('link', { name: /study the model/i }),
    ).toHaveAttribute('href', '#why-rocky');
  });

  test('renders mechanism, tokenomics, faq, and footer copy', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /trading is mining\. holding is discount\. loop closes\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /1 billion pocky\. fixed supply\. half to users\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /frequently asked questions/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /sealed in canton\. forged in rocky\./i,
      }),
    ).toBeInTheDocument();

    mechanismSteps.forEach((step) => {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
      expect(screen.getByText(step.metric)).toBeInTheDocument();
    });

    tokenomicsAllocations.forEach((allocation) => {
      expect(screen.getAllByText(allocation.share).length).toBeGreaterThan(0);
      expect(screen.getByText(allocation.label)).toBeInTheDocument();
      expect(screen.getByText(allocation.detail)).toBeInTheDocument();
    });
  });

  test('renders faq answers and homepage schema as crawlable html', () => {
    const { container } = render(<HomePage />);

    expect(
      screen
        .getAllByRole('link', { name: /^launch app$/i })
        .some((link) => link.getAttribute('href') === '#hero'),
    ).toBe(true);

    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    });

    const schemaScripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    ).map((script) => script.textContent);

    expect(schemaScripts).toHaveLength(2);
    expect(schemaScripts[0]).toContain('"@type":"Organization"');
    expect(schemaScripts[1]).toContain('"@type":"FAQPage"');
    expect(schemaScripts[1]).toContain(faqItems[0].question);
    expect(schemaScripts[1]).not.toContain('</script>');
  });

  test('exports crawlable seo metadata for robots and sitemap', async () => {
    expect(siteMetadata.alternates?.canonical).toBe(homepageUrl);
    expect(siteMetadata.robots).toEqual({
      index: true,
      follow: true,
    });
    expect(siteMetadata.openGraph?.url).toBe(homepageUrl);
    expect(siteMetadata.openGraph?.siteName).toBe('Rocky');

    const robotsMetadata = await robots();
    expect(robotsMetadata).toEqual({
      rules: [{ userAgent: '*', allow: '/' }],
      sitemap: sitemapUrl,
    });
    expect(`Sitemap: ${robotsMetadata.sitemap}`).toBe(
      'Sitemap: https://rocky.exchange/sitemap.xml',
    );

    const sitemapMetadata = await sitemap();
    expect(sitemapMetadata).toEqual([
      {
        url: homepageUrl,
      },
    ]);
    expect(sitemapMetadata.map((entry) => entry.url).join('\n')).toBe(
      'https://rocky.exchange/',
    );
  });
});
