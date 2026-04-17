import type { Metadata } from 'next';

export const siteUrl = 'https://rocky.exchange';
export const homepageUrl = `${siteUrl}/`;
export const sitemapUrl = `${siteUrl}/sitemap.xml`;

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: homepageUrl,
  },
  title: 'Rocky | POCKY Crypto Trading Platform',
  description:
    'Rocky is a crypto trading platform where trading activity connects to the POCKY token loop, fixed supply tokenomics, and a premium beginner-ready experience.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Trade on Rocky and explore the POCKY-powered token loop, fixed supply model, and brand-led onboarding experience.',
    siteName: 'Rocky',
    url: homepageUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Explore Rocky, the cinematic trading platform built around the POCKY token model.',
  },
};
