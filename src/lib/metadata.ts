import type { Metadata } from 'next';

export const siteUrl = 'https://rocky.exchange';
export const homepageUrl = `${siteUrl}/`;
export const sitemapUrl = `${siteUrl}/sitemap.xml`;

export const siteTitle = 'Rocky | Crypto Trading Platform on Canton Network';
export const siteDescription =
  'Rocky is a crypto trading platform on the Canton Network where trading activity connects to the Rocky token loop, fixed supply tokenomics, and a premium beginner-ready experience.';

const ogImage = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Rocky — crypto trading platform on the Canton Network',
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Rocky',
  category: 'finance',
  keywords: [
    'Rocky',
    'Rocky Exchange',
    'Canton Network',
    'crypto trading platform',
    'crypto exchange',
    'Rocky token',
    'fixed supply tokenomics',
    'trading is mining',
  ],
  icons: {
    icon: [
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/brand/rocky-mark.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: homepageUrl,
  },
  title: siteTitle,
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteTitle,
    description:
      'Trade on Rocky and explore the Rocky-powered token loop, fixed supply model, and brand-led onboarding experience.',
    siteName: 'Rocky',
    url: homepageUrl,
    type: 'website',
    locale: 'en_US',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Rocky_exchange',
    creator: '@Rocky_exchange',
    title: siteTitle,
    description:
      'Explore Rocky, the cinematic trading platform built around the Rocky token model.',
    images: [ogImage],
  },
};
