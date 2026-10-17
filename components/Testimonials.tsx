import Link from 'next/link';
import Icon from './Icon';
import Reveal from './Reveal';
import { Section, SectionHeading } from './Section';
import { Stagger, StaggerItem } from './Stagger';
import { testimonials } from '@/lib/site';

/** Étoiles de notation (lecture : « 5 sur 5 »). */
export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-[#f5c451]" role="img" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? '' : 'text-white/15'}>
          <Icon name="star" className="h-4 w-4 fill-current" />
        </span>
      ))}
    </span>
  );
}

/**
 * Section « Avis clients ». N'affiche rien tant qu'aucun avis n'est publié
 * (liste `testimonials` de lib/site.ts).
 */
export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Avis clients"
            title="Ils m'ont fait confiance"
            intro="Des retours publiés avec l'accord de leurs auteurs."
          />
          <Link href="/avis" className="link-arrow">
            Laisser un avis
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
      <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <StaggerItem
            key={`${t.name}-${t.text.slice(0, 20)}`}
            as="article"
            hover
            className="glass-panel h-full"
          >
            <Stars rating={t.rating} />
            <blockquote className="mt-4 text-sm leading-relaxed text-white/75">
              « {t.text} »
            </blockquote>
            <p className="mt-5 text-sm font-medium text-white">{t.name}</p>
            {(t.role || t.date) && (
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                {[t.role, t.date].filter(Boolean).join(' · ')}
              </p>
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
