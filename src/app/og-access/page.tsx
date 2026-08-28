import type { Metadata } from 'next';

import { OgApplicationForm } from '@/components/og-access/og-application-form';

const ogAccessTitle = 'Apply for OG Access | Rocky';
const ogAccessDescription =
  'Apply for early access to Rocky, the privacy-first trading experience built on Canton.';

export const metadata: Metadata = {
  title: ogAccessTitle,
  description: ogAccessDescription,
  alternates: {
    canonical: '/og-access/',
  },
  openGraph: {
    title: ogAccessTitle,
    description: ogAccessDescription,
    url: '/og-access/',
  },
  twitter: {
    title: ogAccessTitle,
    description: ogAccessDescription,
  },
};

export default function OgAccessPage() {
  return <OgApplicationForm />;
}
