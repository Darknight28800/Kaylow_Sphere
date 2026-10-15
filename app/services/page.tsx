import Link from 'next/link';
import Icon from '@/components/Icon';
import CtaBand from '@/components/CtaBand';
import PageHeader from '@/components/PageHeader';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { Section } from '@/components/Section';
import { services } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Services',
  description:
    "Sites vitrines, applications web sur mesure et maintenance. Chaque projet fait l'objet d'un devis sur mesure, sans grille tarifaire.",
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Sites, applications et suivi technique"
        intro="Je présente mes services sans grille tarifaire : chaque projet est différent, chaque devis l'est aussi. Vous m'exposez votre besoin, je vous réponds avec une proposition claire."
      />

      <Section>
        <Stagger className="space-y-6" gap={0.12}>
          {services.map((s, i) => (
            <StaggerItem
              key={s.key}
              as="article"
              id={s.key}
              className="glass-panel glass-sheen grid scroll-mt-24 gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_1.25fr]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-white/55">
                    {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl">{s.title}</h2>
                <p className="mt-4 prose-light">{s.description}</p>
              </div>
              <ul className="grid gap-3 self-start rounded-xl border border-white/10 bg-white/[0.03] p-5">
                {s.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-white/75">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="panel" className="border-y border-white/10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">
              <span
                className="h-px w-10 bg-gradient-to-r from-accent to-transparent"
                aria-hidden="true"
              />
              <span>Bon à savoir</span>
            </p>
            <h2 className="font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              Pas de devis ? Pas de projet.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Le premier échange et le devis sont gratuits et sans engagement. Je ne démarre rien tant
              que le périmètre, le calendrier et le budget ne sont pas validés par écrit.
            </p>
          </div>
          <Link href="/contact" className="btn-primary justify-self-start lg:justify-self-end">
            Décrire mon projet
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <CtaBand title="Un besoin qui ne rentre dans aucune case ?" />
    </>
  );
}
