import type { Metadata } from 'next';
import { Suspense } from 'react';

import { OgContributionPage } from '@/components/og-access/og-contribution-page';

export const metadata: Metadata = {
  title: 'Contribution Update | Rocky OG Access',
  description:
    'Add optional public contribution evidence to a Rocky OG application.',
};

export default function ContributionUpdatePage() {
  return (
    <Suspense fallback={null}>
      <OgContributionPage />
    </Suspense>
  );
}
