import { faqItems } from '@/content/homepage';
import { siteMetadata } from '@/lib/metadata';
import { buildFaqSchema, buildOrganizationSchema } from '@/lib/schema';

describe('schema builders', () => {
  test('returns faq schema with every homepage question', () => {
    const schema = buildFaqSchema(faqItems);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(faqItems.length);
    expect(schema.mainEntity[0].name).toBe(faqItems[0].question);
  });

  test('returns organization schema for Rocky', () => {
    const schema = buildOrganizationSchema();

    expect(schema.name).toBe('Rocky');
    expect(schema['@type']).toBe('Organization');
  });
});

describe('site metadata', () => {
  test('exports the Rocky metadata baseline', () => {
    expect(siteMetadata.metadataBase?.toString()).toBe('https://rocky.exchange/');
    expect(siteMetadata.title).toBe('Rocky | Rocky Crypto Trading Platform');
    expect(siteMetadata.openGraph?.title).toBe('Rocky | Rocky Crypto Trading Platform');
    expect(siteMetadata.twitter?.title).toBe('Rocky | Rocky Crypto Trading Platform');
  });
});
