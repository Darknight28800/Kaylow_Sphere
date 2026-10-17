import Link from 'next/link';
import AuditForm from '@/components/AuditForm';
import Faq from '@/components/Faq';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { Section, SectionHeading } from '@/components/Section';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Audit gratuit de votre site internet',
  description:
    'Recevez gratuitement l’audit de votre site internet sous 48 h : vitesse, affichage mobile, référencement Google, sécurité et contact. Rapport clair, sans engagement. Eure-et-Loir et partout en France.',
  path: '/audit-gratuit',
});

const checks: [string, string][] = [
  ['Vitesse', 'Le temps de chargement, surtout sur téléphone, et ce qui le ralentit.'],
  ['Mobile', 'L’affichage et la facilité d’utilisation sur smartphone.'],
  ['Référencement', 'Ce que Google comprend de votre site : titres, descriptions, structure.'],
  ['Visibilité locale', 'Votre présence sur les recherches de votre ville et votre fiche Google.'],
  ['Sécurité', 'Le cadenas HTTPS, les mentions légales et les points de vigilance.'],
  ['Contact', 'La facilité pour un visiteur de vous appeler ou de demander un devis.'],
];

const steps: [string, string][] = [
  ['Vous remplissez le formulaire', 'L’adresse de votre site et votre objectif. Deux minutes.'],
  ['J’analyse votre site', 'Avec des outils professionnels et un regard humain.'],
  ['Vous recevez le rapport', 'Sous 48 h ouvrées : une note par critère et vos 3 priorités.'],
  ['Vous décidez', 'Corriger vous-même, avec moi, ou ne rien faire. Aucune obligation.'],
];

const faq = [
  {
    q: 'Pourquoi est-ce gratuit ?',
    a: 'C’est ma façon de me faire connaître : vous voyez concrètement comment je travaille avant de décider quoi que ce soit. Il n’y a aucun engagement et aucune relance insistante.',
  },
  {
    q: 'Dois-je vous donner un accès à mon site ?',
    a: 'Non. L’audit porte sur ce que voient vos visiteurs et Google ; aucun identifiant n’est nécessaire.',
  },
  {
    q: 'Et si je n’ai pas encore de site ?',
    a: 'Cochez la case prévue : je regarde votre présence en ligne actuelle (fiche Google, réseaux sociaux, concurrents locaux) et je vous conseille sur la meilleure façon de démarrer.',
  },
  {
    q: 'Mon site a été fait par un autre prestataire, est-ce un problème ?',
    a: 'Pas du tout. Le rapport vous donne des points concrets que vous pouvez transmettre à votre prestataire actuel.',
  },
];

export default function AuditGratuitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Audit gratuit"
        title={'Votre site vous rapporte‑t‑il des clients ?'}
        intro="Recevez gratuitement l'audit de votre site sous 48 h : ce qui fonctionne, ce qui fait fuir vos visiteurs, et les 3 actions prioritaires pour être mieux trouvé et plus contacté."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start [&>*]:min-w-0">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Ce que j'analyse"
                title="6 points clés, expliqués simplement"
              />
            </Reveal>
            <ul className="mt-8 space-y-5">
              {checks.map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <strong className="font-medium text-white">{title}</strong>
                    <span className="text-white/65"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <AuditForm />
        </div>
      </Section>

      <Section tone="panel" className="border-y border-white/10">
        <Reveal>
          <SectionHeading eyebrow="Comment ça marche" title="Simple, rapide, sans engagement" />
        </Reveal>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, desc], i) => (
            <li key={title} className="glass-panel h-full">
              <span className="font-mono text-xs tracking-widest text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-base">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] [&>*]:min-w-0">
          <Reveal>
            <SectionHeading
              eyebrow="Questions fréquentes"
              title="Avant de demander votre audit"
              intro="Une autre question ?"
            />
            <Link href="/contact" className="link-arrow mt-4">
              Me contacter
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
          <Faq items={faq} />
        </div>
      </Section>
    </>
  );
}
