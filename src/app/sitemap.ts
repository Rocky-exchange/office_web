import type { MetadataRoute } from 'next';

import { homepageUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: homepageUrl,
    },
  ];
}
