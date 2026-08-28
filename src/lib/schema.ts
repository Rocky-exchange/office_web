import { faqItems, footerSocialLinks } from '@/content/homepage';
import { siteDescription, siteUrl } from '@/lib/metadata';

type FaqItem = (typeof faqItems)[number];

export function buildFaqSchema(items: ReadonlyArray<FaqItem>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Rocky',
    url: `${siteUrl}/`,
    logo: `${siteUrl}/brand/rocky-mark.svg`,
    image: `${siteUrl}/og-image.jpg`,
    description: siteDescription,
    sameAs: footerSocialLinks.map((link) => link.href),
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Rocky',
    url: `${siteUrl}/`,
    publisher: { '@id': `${siteUrl}/#organization` },
  };
}
