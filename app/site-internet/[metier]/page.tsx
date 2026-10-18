import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { ProjectThumb } from '@/components/ProjectMedia';
import Reveal from '@/components/Reveal';
import { Section, SectionHeading } from '@/components/Section';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { cities } from '@/lib/local';
import { pageMetadata } from '@/lib/seo';
import { projects } from '@/lib/site';
import { trades } from '@/lib/trades';

export function generateStaticParams() {
  return trades.map((t) => ({ metier: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ metier: string }>;
}): Promise<Metadata> {
  const { metier } = await params;
  const trade = trades.find((t) => t.slug === metier);
  if (!trade)
    return pageMetadata({
      title: 'Page introuvable',
      description: '',
      path: `/site-internet/${metier}`,
      noindex: true,
    });
  return pageMetadata({
    title: trade.seoTitle,
    description: trade.description,
    path: `/site-internet/${trade.slug}`,
  });
}

export default async function TradePage({ params }: { params: Promise<{ metier: string }> }) {
  const { metier } = await params;
  const trade = trades.find((t) => t.slug === metier);
  if (!trade) notFound();

  const example = trade.example ? projects.find((p) => p.slug === trade.example) : undefined;
  const others = trades.filter((t) => t.slug !== trade.slug);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: trade.faq.map((f) => ({
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
        eyebrow={`${trade.name} · Eure-et-Loir`}
        title={`Site internet ${trade.forWho}`}
        intro={trade.intro}
      >
        <Link href="/contact" className="btn-primary">
          Demander un devis
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link href="/audit-gratuit" className="btn-outline">
          Audit gratuit de mon site
        </Link>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr] [&>*]:min-w-0">
          <Reveal>
            <SectionHeading
              eyebrow="Vos clients"
              title="Ce qu'ils cherchent avant de vous appeler"
            />
            <ul className="mt-8 space-y-4">
              {trade.needs.map((item) => (
                <li key={item} className="flex gap-3 text-white/75">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {trade.features.map((f) => (
              <StaggerItem key={f.title} as="article" hover className="glass-panel h-full">
                <h3 className="text-lg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{f.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {example && (
        <Section tone="panel" className="border-y border-white/10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center [&>*]:min-w-0">
            <Reveal>
              <SectionHeading eyebrow="Exemple" title={example.name} intro={example.tagline} />
              <Link href={`/portfolio/${example.slug}`} className="link-arrow mt-6">
                Voir la réalisation
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
            <Reveal>
              <Link href={`/portfolio/${example.slug}`} className="block">
                <ProjectThumb project={example} />
              </Link>
            </Reveal>
          </div>
        </Section>
      )}

      <Section
        tone={example ? 'navy' : 'panel'}
        className={example ? '' : 'border-y border-white/10'}
      >
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Formules"
              title="Une formule adaptée à votre activité"
              intro="Devis gratuit, prix nets (TVA non applicable), paiement en 2 ou 3 fois sans frais. Toutes les formules sont détaillées sur la page Tarifs."
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
            <SectionHeading
              eyebrow="Questions fréquentes"
              title={`Site internet ${trade.forWho}`}
            />
          </Reveal>
          <Faq items={trade.faq} />
        </div>
      </Section>

      <Section className="!pt-0">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">
          Autres métiers accompagnés
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/site-internet/${t.slug}`}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition-colors hover:border-accent/50 hover:text-accent"
            >
              {t.name}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">
          J&apos;interviens dans toute l&apos;Eure-et-Loir, notamment à{' '}
          {cities.map((c, i) => (
            <span key={c.slug}>
              <Link href={`/creation-site-internet/${c.slug}`} className="link-accent">
                {c.name}
              </Link>
              {i < cities.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
