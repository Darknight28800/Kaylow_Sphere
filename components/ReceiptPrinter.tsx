'use client';

import Image from 'next/image';
import { useMemo, type PointerEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import Icon from './Icon';

export type PrinterPhase = 'sending' | 'printing' | 'done';

export interface Receipt {
  ref: string;
  name: string;
  projectType: string;
  date: Date;
}

const EASE = [0.22, 1, 0.36, 1] as const;
/** Durée de sortie du ticket (s). Le parent passe en « done » à la fin via onPrinted. */
const FEED_S = 2.6;

/** Avance saccadée façon imprimante thermique : courtes poussées et micro-pauses. */
const FEED_Y = ['-100%', '-84%', '-82%', '-63%', '-61%', '-41%', '-39%', '-19%', '-17%', '0%'];

const STATUS: Record<PrinterPhase, string> = {
  sending: 'Envoi de votre demande',
  printing: 'Impression du récapitulatif',
  done: 'Demande enregistrée',
};

/**
 * Imprimante à tickets : confirmation tactile du formulaire de contact.
 * L'écran affiche l'état de l'envoi ; une fois le message parti, un ticket
 * récapitulatif sort de la fente par à-coups, puis un tampon « reçu » vient
 * le valider. Le ticket est du vrai texte (lisible par les lecteurs
 * d'écran) ; l'état est annoncé via une région live. Animations réduites :
 * simples fondus.
 */
export default function ReceiptPrinter({
  phase,
  receipt,
  onPrinted,
}: {
  phase: PrinterPhase;
  receipt: Receipt | null;
  onPrinted?: () => void;
}) {
  const reduce = useReducedMotion();
  const printing = phase === 'printing';

  return (
    <div className="mx-auto w-full max-w-[25rem]">
      {/* Corps de l'imprimante */}
      <div className="printer-body relative z-10 rounded-[2rem] p-5">
        {/* Plaque supérieure : marque gravée + voyant */}
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="flex items-center gap-2">
            <Image
              src="/logo-sphere.png"
              alt=""
              width={20}
              height={20}
              className="opacity-80 grayscale-[30%]"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
              Kaylow Sphere
            </span>
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
            {phase === 'done' ? 'Prêt' : 'Actif'}
            <span
              aria-hidden="true"
              className={`printer-led ${phase === 'done' ? 'printer-led--done' : ''}`}
            />
          </span>
        </div>

        {/* Écran rétroéclairé */}
        <div className="printer-screen relative overflow-hidden rounded-xl px-4 py-3">
          <div
            className="relative z-10 flex items-center gap-3 font-mono text-xs"
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
              {phase === 'done' ? (
                <motion.span
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="text-emerald-300"
                >
                  <Icon name="check" className="h-4 w-4" />
                </motion.span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-accent/25 border-t-accent motion-safe:animate-spin" />
              )}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={phase}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="printer-screen-text truncate"
              >
                {STATUS[phase]}
                {phase !== 'done' && '…'}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Barre de progression */}
          <div className="relative z-10 mt-2.5 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
            {phase === 'sending' ? (
              <span className="beam-loader__fill" />
            ) : (
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-accent to-brand-400"
                initial={reduce ? false : { width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: reduce ? 0 : FEED_S, ease: 'linear' }}
              />
            )}
          </div>
        </div>

        {/* Fente de sortie, éclairée par la tête d'impression */}
        <div className="relative mx-2 mt-5 h-3 rounded-full bg-black shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)]">
          <motion.span
            aria-hidden="true"
            className="printer-head absolute inset-x-6 top-1/2 h-px -translate-y-1/2"
            animate={{ opacity: printing ? [0.35, 1, 0.5, 1] : 0.15 }}
            transition={
              printing ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }
            }
          />
        </div>
      </div>

      {/* Ticket — glisse hors de la fente (le haut est masqué sous l'imprimante) */}
      <div className="relative -mt-4 overflow-hidden px-3 pb-10 sm:px-6">
        {receipt && phase !== 'sending' && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: '-100%' }}
            animate={reduce ? { opacity: 1 } : { y: FEED_Y }}
            transition={
              reduce
                ? { duration: 0.3 }
                : { duration: FEED_S, ease: 'easeInOut', times: feedTimes() }
            }
            onAnimationComplete={onPrinted}
          >
            <TiltTicket disabled={!!reduce || phase !== 'done'}>
              <ReceiptPaper receipt={receipt} stamped={phase === 'done'} reduce={!!reduce} />
            </TiltTicket>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Instants des à-coups : chaque poussée dure plus longtemps que la pause qui suit. */
function feedTimes() {
  const t: number[] = [0];
  const segs = FEED_Y.length - 1;
  let acc = 0;
  const weights = Array.from({ length: segs }, (_, i) => (i % 2 === 0 ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  for (const w of weights) {
    acc += w;
    t.push(acc / total);
  }
  return t;
}

/** Légère inclinaison 3D qui suit la souris, une fois le ticket imprimé. */
function TiltTicket({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div style={disabled ? undefined : { rotateX: rx, rotateY: ry }}>
        {children}
      </motion.div>
    </div>
  );
}

function ReceiptPaper({
  receipt,
  stamped,
  reduce,
}: {
  receipt: Receipt;
  stamped: boolean;
  reduce: boolean;
}) {
  const date = receipt.date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const time = receipt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    // Ombre portée sur le conteneur : le masque du papier couperait une box-shadow
    <div className="ticket-shadow">
      <div className="ticket-edge">
        <div
          className="ticket-paper relative font-sans text-ink"
          aria-label="Récapitulatif de votre demande"
        >
          {/* Bande holographique de sécurité */}
          <span
            aria-hidden="true"
            className={`ticket-holo ${stamped && !reduce ? 'ticket-holo--sweep' : ''}`}
          />

          <div className="px-5 pb-6 pt-7 sm:px-7">
            {/* En-tête */}
            <div className="flex items-center gap-3">
              <Image src="/logo-sphere.png" alt="" width={34} height={34} />
              <div className="leading-tight">
                <p className="font-heading text-[15px] font-semibold tracking-[-0.01em] text-navy">
                  Kaylow Sphere
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/55">
                  Développeur web fullstack
                </p>
              </div>
            </div>

            <div aria-hidden="true" className="mt-5 border-t-2 border-navy/80" />
            <p className="mt-[3px] border-t border-navy/30 pt-2 text-center font-mono text-[9.5px] uppercase tracking-[0.34em] text-ink/70">
              Récapitulatif de demande
            </p>

            {/* Référence, façon carte d'embarquement */}
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink/50">
                  Référence
                </p>
                <p className="mt-1 whitespace-nowrap font-mono text-[22px] font-medium leading-none tracking-[0.06em] text-navy sm:text-[26px] sm:tracking-[0.08em]">
                  {receipt.ref}
                </p>
              </div>
              <div className="shrink-0 whitespace-nowrap text-right font-mono text-[10px] leading-snug text-ink/70">
                <p>{date}</p>
                <p>{time}</p>
              </div>
            </div>

            {/* Détails, avec points de conduite */}
            <dl className="mt-5 space-y-2 text-[12px]">
              <Leader label="Client" value={receipt.name || '—'} />
              <Leader label="Projet" value={receipt.projectType} />
              <Leader label="Devis" value="Gratuit, sans engagement" />
            </dl>

            {/* Prochaines étapes */}
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/50">
              Prochaines étapes
            </p>
            <ol className="relative mt-3 space-y-2.5 pl-6 text-[11.5px] leading-snug">
              <span
                aria-hidden="true"
                className="absolute bottom-1.5 left-[7px] top-1.5 w-px bg-gradient-to-b from-brand/60 to-brand/10"
              />
              <Step n="1" title="Lecture de votre demande" note="aujourd'hui" active />
              <Step n="2" title="Réponse personnalisée" note="sous 48 h ouvrées" />
              <Step n="3" title="Proposition & devis" note="après échange" />
            </ol>
          </div>

          {/* Talon détachable : perforation + encoches */}
          <div className="ticket-stub relative h-[168px] px-5 pt-6 sm:px-7">
            <span aria-hidden="true" className="ticket-perforation" />
            <Barcode seed={receipt.ref} />
            <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink/60">
              <span>{receipt.ref}</span>
              <span>kaylowsphere.com</span>
            </div>
            <p className="mt-4 text-center font-heading text-[12px] font-medium italic text-navy/80">
              Merci pour votre confiance.
            </p>
          </div>

          {/* Tampon « reçu » */}
          <Stamp visible={stamped} reduce={reduce} />
        </div>
      </div>
    </div>
  );
}

function Leader({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink/55">
        {label}
      </dt>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-ink/30" />
      <dd className="max-w-[62%] truncate text-right font-medium text-navy">{value}</dd>
    </div>
  );
}

function Step({
  n,
  title,
  note,
  active,
}: {
  n: string;
  title: string;
  note: string;
  active?: boolean;
}) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-6 top-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full font-mono text-[8px] font-medium ${
          active
            ? 'bg-brand text-white shadow-[0_0_0_3px_rgba(91,61,246,0.15)]'
            : 'border border-ink/25 bg-white text-ink/60'
        }`}
      >
        {n}
      </span>
      <span className="font-medium text-navy">{title}</span>
      <span className="text-ink/55"> — {note}</span>
    </li>
  );
}

/** Code-barres décoratif, dérivé de la référence (même référence → même motif). */
function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const next = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return (h >>> 0) / 4294967296;
    };
    return Array.from({ length: 54 }, () => ({
      w: 1 + Math.floor(next() * 3.2),
      gap: 1 + Math.floor(next() * 2.4),
    }));
  }, [seed]);

  return (
    <div aria-hidden="true" className="flex h-11 items-stretch justify-center overflow-hidden">
      {/* Gardes de début et de fin, comme un vrai code-barres */}
      <span className="w-[2px] bg-navy" />
      <span className="ml-[2px] w-[2px] bg-navy" />
      {bars.map((b, i) => (
        <span
          key={i}
          className="bg-navy"
          style={{ width: b.w, marginLeft: b.gap, opacity: 0.92 }}
        />
      ))}
      <span className="ml-[2px] w-[2px] bg-navy" />
      <span className="ml-[2px] w-[2px] bg-navy" />
    </div>
  );
}

/** Tampon encreur circulaire, texte en arc (SVG), posé à la fin de l'impression. */
function Stamp({ visible, reduce }: { visible: boolean; reduce: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="ticket-stamp pointer-events-none absolute right-3 top-3"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.9, rotate: -24 }}
          animate={{ opacity: 0.88, scale: 1, rotate: -14 }}
          transition={
            reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 520, damping: 22, mass: 0.9 }
          }
        >
          <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]">
            <defs>
              <path id="stamp-arc-top" d="M 20 60 A 40 40 0 0 1 100 60" />
              <path id="stamp-arc-bottom" d="M 16 60 A 44 44 0 0 0 104 60" />
            </defs>
            <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="60" cy="60" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <text
              fill="currentColor"
              fontSize="10.5"
              fontWeight="700"
              letterSpacing="2.6"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              <textPath href="#stamp-arc-top" startOffset="50%" textAnchor="middle">
                DEMANDE REÇUE
              </textPath>
            </text>
            <text
              fill="currentColor"
              fontSize="8"
              fontWeight="600"
              letterSpacing="2.4"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              <textPath href="#stamp-arc-bottom" startOffset="50%" textAnchor="middle">
                ★ KAYLOW SPHERE ★
              </textPath>
            </text>
            <path
              d="M 47 60 L 56 69 L 74 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
