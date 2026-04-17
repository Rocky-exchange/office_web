import { faqItems } from '@/content/homepage';

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
    name: 'Rocky',
    url: 'https://rocky.exchange',
    logo: 'https://rocky.exchange/og-image.png',
  };
}
