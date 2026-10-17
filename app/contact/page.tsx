import Link from 'next/link';
import Icon from '@/components/Icon';
import ContactForm from '@/components/ContactForm';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Décrivez votre projet web : je vous réponds sous 48 h ouvrées avec un premier avis et les prochaines étapes.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre projet"
        intro="Quelques lignes sur votre besoin suffisent pour démarrer. Je vous réponds sous 48 h ouvrées avec un premier avis, les questions utiles et les prochaines étapes."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="flex w-fit items-center gap-3 break-all text-white/75 hover:text-accent"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Icon name="mail" className="h-5 w-5" />
                </span>
                {site.email}
              </a>
              {site.phone && (
                <a
                  href={`tel:${site.phoneHref}`}
                  className="flex w-fit items-center gap-3 text-white/75 hover:text-accent"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  {site.phone}
                </a>
              )}
              <p className="flex items-center gap-3 text-white/75">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Icon name="map-pin" className="h-5 w-5" />
                </span>
                {site.location}
              </p>
            </div>

            <p className="mt-8 text-xs text-white/60">
              Les informations transmises servent uniquement à traiter votre demande. Voir la{' '}
              <Link href="/confidentialite" className="link-accent">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>

          <ContactForm />
        </div>
      </Section>
    </>
  );
}
