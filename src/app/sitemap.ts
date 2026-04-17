import type { MetadataRoute } from 'next';

import { homepageUrl } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: homepageUrl,
    },
  ];
}
