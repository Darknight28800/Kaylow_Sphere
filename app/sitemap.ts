import type { MetadataRoute } from 'next';
import { posts } from '@/lib/blog';
import { cities } from '@/lib/local';
import { projects, site } from '@/lib/site';
import { trades } from '@/lib/trades';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${site.url}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/tarifs`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/portfolio`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/avis`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}/audit-gratuit`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    {
      url: `${site.url}/creation-site-internet`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${site.url}/site-internet`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...trades.map((t) => ({
      url: `${site.url}/site-internet/${t.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${site.url}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...cities.map((c) => ({
      url: `${site.url}/creation-site-internet/${c.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
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
