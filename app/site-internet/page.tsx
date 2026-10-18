import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { pageMetadata } from '@/lib/seo';
import { trades } from '@/lib/trades';

export const metadata = pageMetadata({
  title: 'Site internet par métier',
  description:
    'Sites internet pensés pour votre métier : artisans du bâtiment, ramoneurs et chauffagistes, commerçants, associations. Développeur web freelance en Eure-et-Loir.',
  path: '/site-internet',
});

export default function TradesHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Par métier"
        title="Un site pensé pour votre métier"
        intro="Un artisan, un commerçant et une association n'attendent pas la même chose de leur site. Chaque page détaille ce que vos clients cherchent et ce que votre site doit leur montrer."
      >
        <Link href="/contact" className="btn-primary">
          Demander un devis
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link href="/tarifs" className="btn-outline">
          Voir les tarifs
        </Link>
      </PageHeader>

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2">
          {trades.map((t) => (
            <StaggerItem key={t.slug} hover className="h-full">
              <Link
                href={`/site-internet/${t.slug}`}
                className="glass-panel group flex h-full flex-col"
              >
                <h2 className="text-xl transition-colors group-hover:text-accent">{t.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{t.short}</p>
                <span className="link-arrow mt-auto pt-6">
                  Voir la page
                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60">
          Votre métier n&apos;est pas dans la liste ? Je crée des sites pour tous les indépendants,
          professions libérales et petites entreprises :{' '}
          <Link href="/contact" className="link-accent">
            parlons de votre activité
          </Link>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
