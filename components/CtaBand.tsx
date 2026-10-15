import Link from 'next/link';
import Icon from './Icon';
import { site } from '@/lib/site';

interface CtaBandProps {
  title?: string;
  text?: string;
}

export default function CtaBand({
  title = 'Un projet en tête ?',
  text = 'Parlons-en. Décrivez-moi votre besoin en quelques lignes, je vous réponds sous 48 h ouvrées avec un premier avis et les prochaines étapes.',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-navy py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 aura" />
      <div className="container-page relative">
        <div className="glass-panel glass-sheen p-8 sm:p-14">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">
                <span
                  className="h-px w-10 bg-gradient-to-r from-accent to-transparent"
                  aria-hidden="true"
                />
                <span>Contact</span>
              </p>
              <h2 className="font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                {title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/70">{text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Demander un devis
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
                <Link href="/portfolio" className="btn-outline">
                  Voir mes réalisations
                </Link>
              </div>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="glass inline-flex items-center gap-3 self-start px-4 py-3 font-mono text-xs text-white/70 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Icon name="mail" className="h-4 w-4" />
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
