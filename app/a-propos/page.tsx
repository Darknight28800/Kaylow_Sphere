import CtaBand from '@/components/CtaBand';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { Section, SectionHeading } from '@/components/Section';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'À propos',
  description: `${site.legalName}, développeur freelance fullstack en ${site.location}. Parcours, méthode de travail et valeurs derrière ${site.name}.`,
  path: '/a-propos',
});

const values: [string, string][] = [
  ['Tech sobre', "Je vais à l'essentiel : des choix techniques justifiés, sans surcouche inutile."],
  [
    'Pédagogue',
    'Je vous explique simplement ce que je fais et pourquoi, pour que vous restiez décisionnaire.',
  ],
  ['Fiable', "Je m'engage sur un périmètre et un calendrier, et je livre par étapes vérifiables."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="À propos" title={`${site.legalName}, derrière ${site.name}`} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <div className="space-y-5 text-lg leading-relaxed text-white/70">
              <p>
                Après une reconversion motivée par la volonté de gagner en liberté et en autonomie,
                j&apos;ai suivi une formation en développement web pour transformer cette envie en
                compétence concrète.
              </p>
              <p>
                Aujourd&apos;hui développeur freelance fullstack, j&apos;accompagne indépendants,
                artisans et petites structures dans la conception de leur site ou de leur application,
                de la première maquette à la mise en production — avec la même exigence que celle qui
                m&apos;a poussé à changer de voie : faire un travail qui a du sens, et le faire bien.
              </p>
              <p>
                {site.name} est la marque sous laquelle j&apos;exerce cette activité, en
                micro-entreprise. Ce site est ma vitrine officielle, indépendante des plateformes
                freelance sur lesquelles on peut aussi me trouver.
              </p>
            </div>
          </div>

          <aside className="glass-panel">
            <h2 className="text-base">En bref</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-white/60">Activité</dt>
                <dd className="mt-0.5 text-white/85">{site.role}</dd>
              </div>
              <div>
                <dt className="text-white/60">Statut</dt>
                <dd className="mt-0.5 text-white/85">{site.status}</dd>
              </div>
              <div>
                <dt className="text-white/60">Localisation</dt>
                <dd className="mt-0.5 text-white/85">{site.location}</dd>
              </div>
              <div>
                <dt className="text-white/60">Stack principale</dt>
                <dd className="mt-0.5 font-mono text-xs text-white/85">
                  React · Node.js · Express · TypeScript
                </dd>
              </div>
              <div>
                <dt className="text-white/60">Contact</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${site.email}`} className="link-accent break-all">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section tone="panel" className="border-y border-white/10">
        <Reveal>
          <SectionHeading eyebrow="Méthode" title="Comment je travaille" />
        </Reveal>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map(([title, desc]) => (
            <StaggerItem key={title} hover className="glass-panel glass-sheen">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                <Icon name="check" />
              </span>
              <h3 className="mt-4 text-base">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand title="On fait connaissance ?" />
    </>
  );
}
