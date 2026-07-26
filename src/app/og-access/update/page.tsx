import type { Metadata } from 'next';

import { OgContributionForm } from '@/components/og-access/og-contribution-form';

export const metadata: Metadata = {
  title: 'Contribution Update | Rocky OG Access',
  description:
    'Add optional public contribution evidence to a Rocky OG application.',
};

type ContributionUpdatePageProps = {
  searchParams: Promise<{ applicationId?: string | string[] }>;
};

export default async function ContributionUpdatePage({
  searchParams,
}: ContributionUpdatePageProps) {
  const params = await searchParams;
  const applicationId = Array.isArray(params.applicationId)
    ? params.applicationId[0]
    : params.applicationId;

  return <OgContributionForm initialApplicationId={applicationId} />;
}
