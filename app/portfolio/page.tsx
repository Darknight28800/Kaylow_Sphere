import Link from 'next/link';
import Icon from '@/components/Icon';
import CtaBand from '@/components/CtaBand';
import PageHeader from '@/components/PageHeader';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { ProjectThumb } from '@/components/ProjectMedia';
import { Section } from '@/components/Section';
import { projects, site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Portfolio',
  description: `Réalisations ${site.name} : Maintenance Ramonage Services, FacturePro, Nexus, Trouve Ton Artisan. Projets clients et produits développés en propre.`,
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Réalisations"
        intro="Des projets menés pour des clients et des produits que je développe et maintiens moi-même."
      />

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.slug} hover className="h-full">
              {/* Carte entière cliquable (lien étiré sur le titre) ; « Voir le site » passe au-dessus */}
              <div className="glass-panel group relative flex h-full flex-col">
                <ProjectThumb project={p} className="mb-5" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl transition-colors group-hover:text-accent">
                      <Link
                        href={`/portfolio/${p.slug}`}
                        className="after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
                      >
                        {p.name}
                      </Link>
                    </h2>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/60">
                      {p.type}
                    </p>
                  </div>
                  {p.status && (
                    <span className="shrink-0 rounded-md border border-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                      {p.status}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-white/70">{p.tagline}</p>
                <p className="mt-auto pt-5 font-mono text-xs text-neutraltxt">
                  {p.stack.join(' · ')}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="link-arrow">
                    Détail du projet
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </span>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-arrow relative z-10"
                    >
                      Voir le site
                      <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand
        title="Votre projet pourrait être le prochain"
        text="Sites vitrines, applications métier, produits SaaS : si le sujet vous ressemble, écrivez-moi."
      />
    </>
  );
}
