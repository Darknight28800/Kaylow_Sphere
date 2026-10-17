import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { posts } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Blog — conseils web pour artisans et petites entreprises',
  description:
    'Conseils concrets pour artisans, commerçants et associations : prix d’un site internet, fiche Google, référencement local, obligations légales.',
  path: '/blog',
});

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogPage() {
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Conseils web, sans jargon"
        intro="Pour les artisans, commerçants, indépendants et associations qui veulent être trouvés en ligne et décrocher plus de clients."
      />
      <Section>
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <StaggerItem key={p.slug} hover className="h-full">
              <Link href={`/blog/${p.slug}`} className="glass-panel group flex h-full flex-col">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {p.category}
                </p>
                <h2 className="mt-3 text-lg leading-snug transition-colors group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{p.description}</p>
                <p className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                  {formatDate(p.date)} · {p.readingMinutes} min
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10 text-sm text-white/60">
          Envie d’un avis sur votre propre site ?{' '}
          <Link href="/audit-gratuit" className="link-accent">
            Demandez un audit gratuit
          </Link>
          .
        </p>
      </Section>
      <CtaBand />
    </>
  );
}
