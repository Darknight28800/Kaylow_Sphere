import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import Icon from '@/components/Icon';
import OfferCard from '@/components/OfferCard';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Testimonials from '@/components/Testimonials';
import { Section, SectionHeading } from '@/components/Section';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { assoOffers, extras, offers, priceFactors, pricingFaq } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tarifs',
  description:
    'Création de site internet dès 500 € en Eure-et-Loir : formules pour artisans, commerçants et indépendants, tarif solidaire pour les associations, suivi à 50 €/mois.',
  path: '/tarifs',
});

const promises: [string, string][] = [
  ['Prix nets', 'TVA non applicable : le prix affiché est le prix payé.'],
  ['Paiement en 2 ou 3 fois', 'Sans frais, pour lisser votre budget.'],
  ['Devis fixe', 'Rien ne bouge sans votre accord écrit.'],
  ['Le site est à vous', 'Nom de domaine à votre nom, site remis à la livraison.'],
];

export default function TarifsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tarifs"
        title="Un site pro, à un prix juste"
        intro="Des formules claires, pensées pour les budgets des artisans, commerçants, indépendants et associations d'Eure-et-Loir. Le premier échange et le devis sont gratuits."
      >
        <Link href="/contact" className="btn-primary">
          Demander un devis gratuit
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <a href="#associations" className="btn-outline">
          Tarif associations
        </a>
      </PageHeader>

      {/* Engagements */}
      <Section className="!py-12 sm:!py-14">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(([term, desc]) => (
            <div key={term} className="border-l border-accent/40 pl-4">
              <dt className="font-mono text-sm font-semibold uppercase tracking-wider text-accent">
                {term}
              </dt>
              <dd className="mt-1.5 text-sm text-white/60">{desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Créations de sites */}
      <Section className="!pt-4">
        <Reveal>
          <SectionHeading
            eyebrow="Création de site"
            title="Artisans, commerçants, indépendants"
            intro="Trois formules pour démarrer, une option sur mesure pour les besoins spécifiques. Chaque fourchette dépend de votre projet : voyez plus bas ce qui la fait varier."
          />
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offers.map((o) => (
            <StaggerItem key={o.key} className="h-full">
              <OfferCard offer={o} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Ce qui fait varier le prix */}
      <Section className="!pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Bien lire les fourchettes"
            title="Ce qui fait varier le prix"
            intro="Le prix final dépend du travail réel. Voici ce qui place un projet en bas ou en haut de sa fourchette."
          />
        </Reveal>
        <Reveal className="mt-12">
          <div className="glass overflow-hidden">
            <div className="hidden grid-cols-[0.8fr_1fr_1fr] gap-6 border-b border-white/10 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 md:grid">
              <span>Critère</span>
              <span>Bas de fourchette</span>
              <span>Haut de fourchette</span>
            </div>
            <dl className="divide-y divide-white/10">
              {priceFactors.map((f) => (
                <div
                  key={f.factor}
                  className="grid gap-2 px-6 py-4 text-sm md:grid-cols-[0.8fr_1fr_1fr] md:gap-6"
                >
                  <dt className="font-medium text-white">{f.factor}</dt>
                  <dd className="flex gap-2 text-white/65">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                    />
                    <span>
                      <span className="sr-only md:hidden">Bas de fourchette : </span>
                      {f.low}
                    </span>
                  </dd>
                  <dd className="flex gap-2 text-white/65">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                    />
                    <span>
                      <span className="sr-only md:hidden">Haut de fourchette : </span>
                      {f.high}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Section>

      {/* Associations */}
      <Section id="associations" tone="panel" className="scroll-mt-20 border-y border-white/10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
          <Reveal>
            <p className="eyebrow mb-5">
              <span
                className="h-px w-10 bg-gradient-to-r from-accent to-transparent"
                aria-hidden="true"
              />
              <span>Tarif solidaire</span>
            </p>
            <h2 className="font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              Associations
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              Les associations font vivre nos communes avec des budgets serrés. Ces formules vont à
              l&apos;essentiel : se présenter, annoncer ses événements, recevoir adhésions et dons
              en ligne.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <Icon name="users" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <strong className="font-medium text-white">HelloAsso intégré</strong> : adhésions,
                  dons et billetterie sans frais ni commission pour l&apos;association.
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <strong className="font-medium text-white">Devis détaillé</strong> à joindre à vos
                  demandes de subvention (FDVA, collectivités).
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <strong className="font-medium text-white">Suivi à 30 € / mois</strong> si vous ne
                  voulez pas vous occuper de la technique.
                </span>
              </li>
            </ul>
          </Reveal>
          <Stagger className="grid gap-6 sm:grid-cols-2">
            {assoOffers.map((o) => (
              <StaggerItem key={o.key} className="h-full">
                <OfferCard offer={o} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Suivi & prestations ponctuelles */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Après la mise en ligne"
            title="Suivi et prestations ponctuelles"
            intro="Pour un site déjà en ligne, réalisé par moi ou par un autre prestataire."
          />
        </Reveal>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {extras.map((o) => (
            <StaggerItem key={o.key} className="h-full">
              <OfferCard offer={o} compact />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Testimonials />

      {/* FAQ */}
      <Section tone="panel" className="border-y border-white/10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Questions fréquentes"
              title="Une question ? Une réponse."
              intro="Vous ne trouvez pas votre réponse ? Écrivez-moi, je vous réponds sous 48 h ouvrées."
            />
          </Reveal>
          <Faq items={pricingFaq} />
        </div>
      </Section>

      <CtaBand
        title="Votre budget, votre projet"
        text="Dites-moi ce dont vous avez besoin et combien vous pouvez y consacrer : je vous propose la formule la plus adaptée, sans engagement."
      />
    </>
  );
}
