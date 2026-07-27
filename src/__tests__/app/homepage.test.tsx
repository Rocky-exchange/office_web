import { render, screen } from '@testing-library/react';

import HomePage from '@/components/home/home-page';
import { faqItems, mechanismSteps } from '@/content/homepage';
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
      'Every Trade You MakeProduces ROCKY.',
      'Trading is Mining.Holding is Discount.Loop Closes.',
      'Frequently Asked Questions',
      'POWERED BY CANTON.DEFINED BY ROCKY.',
    ]);
  });

  test('renders navigation and cta anchors for the implemented sections only', () => {
    render(<HomePage />);

    const nav = screen.getByRole('navigation', { name: /primary/i });
    const navLinks = screen.getAllByRole('link').filter((link) => nav.contains(link));

    expect(navLinks).toHaveLength(4);
    expect(
      navLinks.map((link) => ({
        text: link.textContent,
        href: link.getAttribute('href'),
      })),
    ).toEqual([
      { text: 'How It Works', href: '#mechanism' },
      { text: 'Trading Is Mining', href: '#trade' },
      { text: 'FAQ', href: '#faq' },
      { text: 'Docs', href: 'https://doc.rocky.exchange/' },
    ]);

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('link', { name: 'Doc' })).toHaveAttribute(
      'href',
      'https://doc.rocky.exchange/',
    );

    expect(
      screen.getAllByRole('link', { name: /launch app/i })[0],
    ).toHaveAttribute('href', 'https://app.rocky.exchange');
    expect(
      screen.queryByRole('link', { name: /apply for og access/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /submit x contribution update/i }),
    ).not.toBeInTheDocument();
  });

  test('renders mechanism, faq, and footer copy', () => {
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
        name: /frequently asked questions/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /powered by canton\. defined by rocky\./i,
      }),
    ).toBeInTheDocument();

    mechanismSteps.forEach((step) => {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  test('renders faq answers and homepage schema as crawlable html', () => {
    const { container } = render(<HomePage />);

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
