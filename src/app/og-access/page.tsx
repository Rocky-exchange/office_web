import type { Metadata } from 'next';

import { OgApplicationForm } from '@/components/og-access/og-application-form';

export const metadata: Metadata = {
  title: 'Apply for OG Access | Rocky',
  description:
    'Apply for early access to Rocky, the privacy-first trading experience built on Canton.',
};

export default function OgAccessPage() {
  return <OgApplicationForm />;
}
