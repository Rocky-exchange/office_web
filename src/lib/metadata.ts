import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://rocky.exchange'),
  title: 'Rocky | POCKY Crypto Trading Platform',
  description:
    'Rocky is a crypto trading platform where trading activity connects to the POCKY token loop, fixed supply tokenomics, and a premium beginner-ready experience.',
  openGraph: {
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Trade on Rocky and explore the POCKY-powered token loop, fixed supply model, and brand-led onboarding experience.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Explore Rocky, the cinematic trading platform built around the POCKY token model.',
  },
};
