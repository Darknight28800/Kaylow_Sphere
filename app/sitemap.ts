import type { MetadataRoute } from 'next';
import { projects, site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${site.url}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/tarifs`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/portfolio`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/avis`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}/a-propos`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.9 },
    ...projects.map((p) => ({
      url: `${site.url}/portfolio/${p.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
