import type { Metadata, Viewport } from 'next';
import { Aldrich, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { siteMetadata } from '@/lib/metadata';
import './globals.css';

const aldrich = Aldrich({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-aldrich',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: '#151511',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${aldrich.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
