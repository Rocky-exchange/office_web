import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { siteMetadata } from '@/lib/metadata';

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: '#151511',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
