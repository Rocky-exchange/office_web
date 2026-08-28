import type { MetadataRoute } from 'next';

import { homepageUrl, siteUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: homepageUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/og-access/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
