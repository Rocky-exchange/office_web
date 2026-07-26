'use client';

import { useSearchParams } from 'next/navigation';

import { OgContributionForm } from '@/components/og-access/og-contribution-form';

export function OgContributionPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId') ?? '';

  return <OgContributionForm initialApplicationId={applicationId} />;
}
