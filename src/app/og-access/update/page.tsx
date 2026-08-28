import type { Metadata } from 'next';
import { Suspense } from 'react';

import { OgContributionPage } from '@/components/og-access/og-contribution-page';

export const metadata: Metadata = {
  title: 'Contribution Update | Rocky OG Access',
  description:
    'Add optional public contribution evidence to a Rocky OG application.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/og-access/update/',
  },
};

export default function ContributionUpdatePage() {
  return (
    <Suspense fallback={null}>
      <OgContributionPage />
    </Suspense>
  );
}
