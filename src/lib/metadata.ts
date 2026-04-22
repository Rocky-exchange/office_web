import type { Metadata } from 'next';

export const siteUrl = 'https://rocky.exchange';
export const homepageUrl = `${siteUrl}/`;
export const sitemapUrl = `${siteUrl}/sitemap.xml`;

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-32x32.png',
  },
  alternates: {
    canonical: homepageUrl,
  },
  title: 'Rocky | Rocky Crypto Trading Platform',
  description:
    'Rocky is a crypto trading platform where trading activity connects to the Rocky token loop, fixed supply tokenomics, and a premium beginner-ready experience.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Rocky | Rocky Crypto Trading Platform',
    description:
      'Trade on Rocky and explore the Rocky-powered token loop, fixed supply model, and brand-led onboarding experience.',
    siteName: 'Rocky',
    url: homepageUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocky | Rocky Crypto Trading Platform',
    description:
      'Explore Rocky, the cinematic trading platform built around the Rocky token model.',
  },
};
