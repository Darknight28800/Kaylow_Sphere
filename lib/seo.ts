import type { Metadata } from 'next';
import { cities } from './local';
import { services, site } from './site';

const BASE_URL = site.url;

/**
 * Fabrique les métadonnées d'une page à partir d'un titre et d'une description.
 * Le suffixe « — {site.name} » et l'URL canonique sont ajoutés automatiquement.
 */
export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}): Metadata {
  const { title, description, path, noindex, type = 'website' } = options;
  const url = `${BASE_URL}${path === '/' ? '' : path}`;

  return {
    title,
    description,
    alternates: { canonical: url || '/' },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: `${title} — ${site.name}`,
      description,
      url: url || BASE_URL,
      siteName: site.name,
      locale: 'fr_FR',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${site.name}`,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

/**
 * Données structurées Schema.org (JSON-LD) injectées dans le layout :
 * activité locale (zone desservie, services) + site web. Aide Google à
 * comprendre qui est derrière le site et où il intervient.
 */
export function structuredData() {
  const id = (frag: string) => `${BASE_URL}/#${frag}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id('business'),
        name: site.name,
        slogan: site.baseline,
        url: BASE_URL,
        email: site.email,
        ...(site.phoneHref ? { telephone: site.phoneHref } : {}),
        logo: `${BASE_URL}/icon-512.png`,
        image: `${BASE_URL}/og-image.png`,
        founder: { '@id': id('founder') },
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Eure-et-Loir',
          addressCountry: 'FR',
        },
        areaServed: [
          ...cities.map((c) => ({ '@type': 'City', name: c.name })),
          { '@type': 'AdministrativeArea', name: 'Eure-et-Loir' },
          { '@type': 'AdministrativeArea', name: 'Centre-Val de Loire' },
          { '@type': 'Country', name: 'France' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              description: s.short,
              url: `${BASE_URL}/services#${s.key}`,
            },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': id('founder'),
        name: site.legalName,
        jobTitle: site.role,
        worksFor: { '@id': id('business') },
      },
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url: BASE_URL,
        name: site.name,
        inLanguage: 'fr-FR',
        publisher: { '@id': id('business') },
      },
    ],
  };
}
