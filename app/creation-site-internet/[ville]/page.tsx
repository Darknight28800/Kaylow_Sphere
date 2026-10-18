import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { Section, SectionHeading } from '@/components/Section';
import { cities } from '@/lib/local';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return cities.map((c) => ({ ville: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city)
    return pageMetadata({
      title: 'Page introuvable',
      description: '',
      path: `/creation-site-internet/${ville}`,
      noindex: true,
    });
  return pageMetadata({
    title: city.seoTitle,
    description: city.description,
    path: `/creation-site-internet/${city.slug}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const others = cities.filter((c) => c.slug !== city.slug);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <PageHeader
        eyebrow={`${city.name} · Eure-et-Loir`}
        title={`Création de site internet ${city.at}`}
        intro={city.intro}
      >
        <Link href="/audit-gratuit" className="btn-primary">
          Audit gratuit de mon site
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link href="/contact" className="btn-outline">
          Demander un devis
        </Link>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 [&>*]:min-w-0">
          <Reveal>
            <SectionHeading
              eyebrow="Pourquoi un site"
              title={`Ce qu'un site change pour une entreprise ${city.at}`}
            />
            <ul className="mt-8 space-y-4">
              {city.context.map((item) => (
                <li key={item} className="flex gap-3 text-white/75">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="glass-panel">
              <p className="eyebrow mb-4">
                <span
                  className="h-px w-10 bg-gradient-to-r from-accent to-transparent"
                  aria-hidden="true"
                />
                <span>Qui j&apos;accompagne</span>
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {city.audiences.map((a) => (
                  <li
                    key={a}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80"
                  >
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-white/60">
                J&apos;interviens {city.at} et dans les communes voisines : {city.nearby.join(', ')}
                . Premier rendez-vous gratuit, en personne ou par téléphone
                {site.phone ? ` au ${site.phone}` : ''}.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="panel" className="border-y border-white/10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Formules"
              title="Des tarifs clairs, pensés pour les petites structures"
              intro="Prix nets (TVA non applicable), devis gratuit, paiement en 2 ou 3 fois sans frais. Toutes les formules sont détaillées sur la page Tarifs."
            />
            <Link href="/tarifs" className="btn-primary">
              Voir les tarifs
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] [&>*]:min-w-0">
          <Reveal>
            <SectionHeading eyebrow="Questions fréquentes" title={`Votre site ${city.at}`} />
          </Reveal>
          <Faq items={city.faq} />
        </div>
      </Section>

      <Section className="!pt-0">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">
          J&apos;interviens aussi à
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/creation-site-internet/${c.slug}`}
              className="btn-outline !px-4 !py-2"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/creation-site-internet" className="btn-outline !px-4 !py-2">
            Toute l&apos;Eure-et-Loir
          </Link>
        </div>
      </Section>

      <CtaBand title={`Un projet ${city.at} ?`} />
    </>
  );
}
