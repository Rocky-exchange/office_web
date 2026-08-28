import { faqItems } from '@/content/homepage';
import { siteMetadata } from '@/lib/metadata';
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '@/lib/schema';

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
    expect(schema.logo).toBe('https://rocky.exchange/brand/rocky-mark.svg');
    expect(schema.sameAs).toContain('https://x.com/Rocky_exchange');
  });

  test('returns website schema linked to the organization', () => {
    const schema = buildWebSiteSchema();

    expect(schema['@type']).toBe('WebSite');
    expect(schema.publisher).toEqual({
      '@id': 'https://rocky.exchange/#organization',
    });
  });
});

describe('site metadata', () => {
  test('exports the Rocky metadata baseline', () => {
    expect(siteMetadata.metadataBase?.toString()).toBe('https://rocky.exchange/');
    expect(siteMetadata.title).toBe(
      'Rocky | Crypto Trading Platform on Canton Network',
    );
    expect(siteMetadata.openGraph?.title).toBe(
      'Rocky | Crypto Trading Platform on Canton Network',
    );
    expect(siteMetadata.twitter?.title).toBe(
      'Rocky | Crypto Trading Platform on Canton Network',
    );
  });

  test('declares social preview images for open graph and twitter', () => {
    const ogImages = siteMetadata.openGraph?.images;
    const twitterImages = siteMetadata.twitter?.images;

    expect(ogImages).toEqual([
      expect.objectContaining({ url: '/og-image.jpg', width: 1200, height: 630 }),
    ]);
    expect(twitterImages).toEqual([
      expect.objectContaining({ url: '/og-image.jpg' }),
    ]);
    expect(siteMetadata.twitter?.card).toBe('summary_large_image');
    expect(siteMetadata.twitter?.site).toBe('@Rocky_exchange');
  });
});
