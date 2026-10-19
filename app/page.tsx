import Link from 'next/link';
import Icon from '@/components/Icon';
import CtaBand from '@/components/CtaBand';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/Reveal';
import { Stagger, StaggerItem } from '@/components/Stagger';
import ScrollParallax from '@/components/animations/ScrollParallax';
import HeroTitle from '@/components/HeroTitle';
import { BlackHoleHero, BlackHoleLayer, GravityPull } from '@/components/BlackHoleHero';
import BigBang from '@/components/BigBang';
import ProcessSteps, { type ProcessStep } from '@/components/ProcessSteps';
import { ProjectThumb, isPortrait } from '@/components/ProjectMedia';
import { Section, SectionHeading } from '@/components/Section';
import { projects, services, site } from '@/lib/site';

// Cartes de l'accueil, dans l'ordre d'affichage.
const featured = ['maintenance-ramonage-services', 'gdf', 'nexus'].flatMap((slug) =>
  projects.filter((p) => p.slug === slug),
);

const proof: [string, string][] = [
  ['A → Z', 'Cadrage, design, développement et mise en ligne'],
  ['Fullstack', 'React · Node.js · TypeScript'],
  ['Direct', 'Un seul interlocuteur, en français clair'],
];

const steps: ProcessStep[] = [
  {
    num: '01',
    title: 'Échange',
    desc: 'On clarifie le besoin, les objectifs et les contraintes. Un premier appel gratuit, sans engagement.',
  },
  {
    num: '02',
    title: 'Devis',
    desc: 'Je vous envoie une proposition chiffrée et un calendrier. Rien ne démarre sans votre validation écrite.',
  },
  {
    num: '03',
    title: 'Développement',
    desc: 'Je livre par étapes : vous voyez le projet avancer et validez au fur et à mesure.',
  },
  {
    num: '04',
    title: 'Mise en ligne',
    desc: 'Déploiement, tests multi-appareils, puis suivi après lancement pour que tout reste à jour.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — texte centré sous le header, trou noir pleine largeur en dessous */}
      <BlackHoleHero className="relative flex flex-col overflow-hidden bg-navy">
        {/* Halo de fond parallaxé */}
        <ScrollParallax speed={0.28} className="pointer-events-none absolute inset-0 h-[150%]">
          <div aria-hidden="true" className="absolute inset-0 aura" />
        </ScrollParallax>

        {/* Contenu principal : aspiré vers le trou noir au scroll */}
        <div className="relative z-10">
          {/* Halo d'une géante bleue cachée derrière le trou noir */}
          <div
            aria-hidden="true"
            className="giant-light pointer-events-none absolute inset-x-0 -bottom-[30vh] top-0"
          />
          <div className="container-page relative w-full pt-10 sm:pt-14 lg:pt-16">
            <GravityPull>
              <Stagger
                gap={0.1}
                className="giant-lit mx-auto flex max-w-5xl flex-col items-center text-center"
              >
                <StaggerItem>
                  <p className="eyebrow mb-7">
                    <span
                      className="h-px w-12 bg-gradient-to-r from-transparent to-accent"
                      aria-hidden="true"
                    />
                    <span>{site.role}</span>
                    <span
                      className="h-px w-12 bg-gradient-to-r from-accent to-transparent"
                      aria-hidden="true"
                    />
                  </p>
                </StaggerItem>
                <HeroTitle />
                <StaggerItem>
                  <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/70">
                    Je suis {site.legalName}, {site.role.toLowerCase()}. J&apos;accompagne
                    indépendants, artisans et petites structures dans la conception de leur site ou
                    de leur application — de la première maquette à la mise en production.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <Link href="/contact" className="btn-primary">
                      Demander un devis
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                    <Link href="/audit-gratuit" className="btn-outline">
                      Audit gratuit de mon site
                    </Link>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <dl className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-7">
                    {proof.map(([term, desc], i) => (
                      <div
                        key={term}
                        className={i > 0 ? 'sm:border-l sm:border-white/10 sm:pl-12' : undefined}
                      >
                        <dt className="font-mono text-sm font-semibold uppercase tracking-wider text-accent">
                          {term}
                        </dt>
                        <dd className="mx-auto mt-1.5 max-w-[20ch] text-sm text-white/60">
                          {desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </StaggerItem>
              </Stagger>
            </GravityPull>
          </div>
        </div>

        {/* Trou noir — pleine largeur, sous le bloc texte (le haut, en fondu, passe derrière) */}
        <BlackHoleLayer className="pointer-events-none relative -mt-16 h-[max(360px,min(40vw,80vh))] w-full sm:-mt-24" />

        {/* Disponibilité */}
        <div className="relative z-10 border-t border-white/[0.07]">
          <div className="container-page flex items-center justify-end py-4">
            <span className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                Disponible pour un projet
              </span>
            </span>
          </div>
        </div>
      </BlackHoleHero>

      {/* Services */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Ce que je peux faire pour vous"
            intro="Trois façons de travailler ensemble, avec des tarifs clairs et un devis gratuit pour chaque projet."
          />
        </Reveal>
        <Stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <StaggerItem
              key={s.key}
              as="article"
              hover
              className="glass-panel glass-sheen h-full pt-8"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{s.short}</p>
              <Link href={`/services#${s.key}`} className="link-arrow mt-6">
                Détail
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Réalisations phares */}
      <Section tone="panel" className="border-y border-white/10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Portfolio"
              title="Quelques réalisations"
              intro="Des projets clients et des produits que je développe et maintiens moi-même."
            />
            <Link href="/portfolio" className="link-arrow hidden sm:inline-flex">
              Tout le portfolio
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        {/* Deux cartes à gauche, la carte au visuel vertical sur toute la hauteur à droite */}
        <Stagger className="mt-16 grid gap-6 md:grid-cols-[1.15fr_1fr]">
          {featured.map((p) => {
            const tall = isPortrait(p.images?.[0]);
            return (
              <StaggerItem
                key={p.slug}
                hover
                className={`h-full ${tall ? 'md:col-start-2 md:row-span-2 md:row-start-1' : ''}`}
              >
                {/* Carte entière cliquable (lien étiré sur le titre) ; « Voir le site » passe au-dessus */}
                <div className="glass-panel group relative flex h-full flex-col">
                  <ProjectThumb project={p} tall={tall} className="mb-5" />
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg transition-colors group-hover:text-accent">
                      <Link
                        href={`/portfolio/${p.slug}`}
                        className="after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
                      >
                        {p.name}
                      </Link>
                    </h3>
                    {p.status && (
                      <span className="shrink-0 rounded-md border border-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white/65">{p.tagline}</p>
                  <p className="mt-auto pt-4 font-mono text-xs text-neutraltxt">
                    {p.stack.join(' · ')}
                  </p>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-arrow relative z-10 mt-4 self-start"
                    >
                      Voir le site
                      <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <div className="mt-10 sm:hidden">
          <Link href="/portfolio" className="btn-outline w-full">
            Tout le portfolio
          </Link>
        </div>
      </Section>

      {/* Big Bang : zone de scroll vide, la galaxie reste ensuite en fond jusqu'en bas */}
      <BigBang className="h-[110vh] motion-reduce:h-[30vh]" />

      {/* Méthode — fond transparent : la galaxie passe dessous */}
      <Section tone="clear">
        <Reveal>
          <SectionHeading
            eyebrow="Méthode"
            title="Un déroulé simple et lisible"
            intro="Vous savez à chaque étape où en est le projet et ce qui vous est demandé."
          />
        </Reveal>
        <div className="mt-16">
          <ProcessSteps steps={steps} />
        </div>
      </Section>

      <Testimonials />

      <CtaBand />
    </>
  );
}
