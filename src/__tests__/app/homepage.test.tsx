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
      'CANTON ENCRYPTS. ROCKY EARNS.',
      'Why Rocky Is Hard To Replicate',
      'Every Trade You Make Produces ROCKY.',
      'Trading is Mining.Holding is Discount.Loop Closes.',
      '1 Billion ROCKY.Fixed Supply. Half to Users.',
      'Frequently Asked Questions',
      'SEALED IN CANTON. FORGED IN ROCKY.',
    ]);
  });

  test('renders navigation and cta anchors for the implemented sections only', () => {
    render(<HomePage />);

    const nav = screen.getByRole('navigation', { name: /primary/i });
    const navLinks = screen.getAllByRole('link').filter((link) => nav.contains(link));

    expect(navLinks).toHaveLength(5);
    expect(
      navLinks.map((link) => ({
        text: link.textContent,
        href: link.getAttribute('href'),
      })),
    ).toEqual([
      { text: 'How It Works', href: '#mechanism' },
      { text: 'Trading Is Mining', href: '#trade' },
      { text: 'Tokenomic', href: '#pocky' },
      { text: 'FAQ', href: '#faq' },
      { text: 'Docs', href: '#footer' },
    ]);

    expect(
      screen.getAllByRole('link', { name: /launch app/i })[0],
    ).toHaveAttribute('href', '#trade');
    expect(
      screen.getByRole('link', { name: /watch 30s demo/i }),
    ).toHaveAttribute('href', '#why-rocky');
  });

  test('renders mechanism, tokenomics, faq, and footer copy', () => {
    render(<HomePage />);

    const mechanismHeading = screen.getByRole('heading', {
      name: /trading is mining\.\s*holding is discount\.\s*loop closes\./i,
    });
    expect(mechanismHeading).toBeInTheDocument();
    expect(
      mechanismHeading.querySelectorAll('.mechanism-intro__line'),
    ).toHaveLength(3);

    const flywheel = screen.getByLabelText(/rocky mechanism flow/i);
    expect(flywheel.querySelectorAll('.flywheel-card')).toHaveLength(5);
    expect(
      screen.getByAltText(/rocky mechanism flywheel diagram/i),
    ).toHaveAttribute('src', expect.stringContaining('group-17.svg'));
    const mechanismSummary = screen
      .getByText(/every trade mints rocky\./i)
      .closest('.section-summary');
    expect(mechanismSummary?.querySelectorAll('.mechanism-intro__summary-line')).toHaveLength(2);

    expect(
      screen.getByRole('heading', {
        name: /1 billion rocky\.\s*fixed supply\.\s*half to users\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/rocky token allocation chart/i),
    ).toHaveAttribute('src', expect.stringContaining('echarts-pie.svg'));

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
    });

    const allocationList = screen.getByRole('list', { name: /rocky allocation/i });
    tokenomicsAllocations.forEach((allocation) => {
      expect(
        allocationList.textContent,
      ).toContain(`${allocation.share} ${allocation.label}. ${allocation.detail}`);
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
