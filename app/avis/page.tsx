import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ReviewForm from '@/components/ReviewForm';
import Testimonials from '@/components/Testimonials';
import { Section } from '@/components/Section';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Laisser un avis',
  description:
    'Vous avez travaillé avec Kaylow Sphere ? Partagez votre expérience : votre avis aide les artisans, commerçants et associations à choisir leur prestataire web.',
  path: '/avis',
});

export default function AvisPage() {
  return (
    <>
      <PageHeader
        eyebrow="Avis"
        title="Votre avis compte"
        intro="Vous avez travaillé avec moi ? Quelques lignes suffisent. Chaque avis est lu personnellement avant d'être publié sur le site."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start [&>*]:min-w-0">
          <div className="space-y-5 text-sm leading-relaxed text-white/65">
            <p>
              Votre retour aide d&apos;autres artisans, commerçants et associations à se faire une
              idée avant de se lancer, et m&apos;aide à m&apos;améliorer.
            </p>
            <ul className="space-y-2.5">
              <li>· Publication avec votre prénom et l&apos;initiale de votre nom</li>
              <li>· Votre e-mail n&apos;est jamais affiché</li>
              <li>· Vous pouvez demander le retrait de votre avis à tout moment</li>
            </ul>
            <p className="text-xs text-white/60">
              Voir la{' '}
              <Link href="/confidentialite" className="link-accent">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
          <ReviewForm />
        </div>
      </Section>

      <Testimonials />
    </>
  );
}
