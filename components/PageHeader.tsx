import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  /** Actions (boutons) sous l'intro. */
  children?: ReactNode;
}

/**
 * En-tête de page — cadrage éditorial pleine largeur : libellé monospace,
 * grand titre display, intro. Utilisé en tête des
 * pages internes (Services, Portfolio, À propos, Contact, pages légales…).
 */
export default function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <header className="section-navy relative overflow-hidden border-b border-white/10 bg-navy">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 aura opacity-80" />

      <div className="container-page relative z-10 py-20 sm:py-28 lg:py-32">
        <Reveal>
          <p className="eyebrow mb-6">
            <span
              className="h-px w-12 bg-gradient-to-r from-accent to-transparent"
              aria-hidden="true"
            />
            <span>{eyebrow}</span>
          </p>
          <h1 className="font-heading text-[clamp(2.6rem,6vw,4.75rem)] font-bold leading-[1.0] tracking-[-0.04em]">
            {title}
          </h1>
          {intro && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
          {children && <div className="mt-10 flex flex-wrap items-center gap-4">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
