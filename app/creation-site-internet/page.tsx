import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Stagger, StaggerItem } from '@/components/Stagger';
import { cities } from '@/lib/local';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Création de site internet en Eure-et-Loir',
  description:
    'Développeur web freelance en Eure-et-Loir : création de sites internet pour artisans, commerçants, indépendants et associations à Chartres, Châteaudun, Bonneval, Voves et alentours.',
  path: '/creation-site-internet',
});

export default function LocalHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eure-et-Loir"
        title="Création de site internet en Eure-et-Loir"
        intro="Je suis développeur web freelance entre Bonneval, Voves, Châteaudun et Chartres. Je crée des sites clairs, rapides et bien référencés pour les entreprises et associations du département, avec un interlocuteur que vous pouvez rencontrer."
      >
        <Link href="/audit-gratuit" className="btn-primary">
          Audit gratuit de mon site
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link href="/tarifs" className="btn-outline">
          Voir les tarifs
        </Link>
      </PageHeader>

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c) => (
            <StaggerItem key={c.slug} hover className="h-full">
              <Link
                href={`/creation-site-internet/${c.slug}`}
                className="glass-panel group flex h-full flex-col"
              >
                <Icon name="map-pin" className="h-5 w-5 text-accent" />
                <h2 className="mt-4 text-xl transition-colors group-hover:text-accent">{c.name}</h2>
                <p className="mt-2 text-sm text-white/60">
                  Et alentours : {c.nearby.slice(0, 3).join(', ')}…
                </p>
                <span className="link-arrow mt-auto pt-6">
                  Voir la page
                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60">
          Votre commune n&apos;est pas dans la liste ? J&apos;interviens dans toute
          l&apos;Eure-et-Loir, et à distance partout en France.
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
