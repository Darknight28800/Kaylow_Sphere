import Link from 'next/link';
import SiteGenerator from '@/components/SiteGenerator';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Démo — testez votre futur site',
  description:
    "Décrivez votre projet et recevez en quelques secondes un aperçu de page d'accueil, généré pour illustrer un style et une ambiance.",
  path: '/demo',
});

export default function DemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Démo"
        title="Testez votre futur site en 30 secondes"
        intro="Décrivez votre activité et l'ambiance recherchée, choisissez vos couleurs (ou laissez-les au hasard) : en une trentaine de secondes, vous obtenez un aperçu de page d'accueil. C'est une illustration de style — pas un site complet — pour donner une idée de direction."
      >
        <p className="text-sm text-white/60">
          3 essais gratuits. Rendu propulsé par l&apos;IA, sans engagement.{' '}
          <Link href="/contact" className="link-accent">
            Un vrai projet ?
          </Link>
        </p>
      </PageHeader>

      <Section>
        <SiteGenerator />
      </Section>
    </>
  );
}
