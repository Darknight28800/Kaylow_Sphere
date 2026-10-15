import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: 'navy' | 'panel' | 'mist';
  id?: string;
}

const toneMap: Record<NonNullable<SectionProps['tone']>, string> = {
  navy: 'bg-navy',
  panel: 'bg-navy-800/40',
  mist: 'bg-mist text-ink',
};

export function Section({ children, className = '', tone = 'navy', id }: SectionProps) {
  return (
    <section id={id} className={`${toneMap[tone]} py-20 sm:py-28 lg:py-32 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: 'navy' | 'mist';
  center?: boolean;
}

/** En-tête de section : libellé monospace + grand titre + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'navy',
  center = false,
}: SectionHeadingProps) {
  const dark = tone !== 'mist';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      {eyebrow && (
        <p className={`eyebrow mb-5 ${center ? 'justify-center' : ''} ${dark ? '' : 'text-brand'}`}>
          <span
            className={`h-px w-10 ${
              dark ? 'bg-gradient-to-r from-accent to-transparent' : 'bg-ink/20'
            }`}
            aria-hidden="true"
          />
          <span>{eyebrow}</span>
        </p>
      )}
      <h2
        className={`font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] ${
          dark ? '' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink/80'}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
