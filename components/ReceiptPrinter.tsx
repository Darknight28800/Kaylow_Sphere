'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
const FEED_S = 1.8;

const STATUS: Record<PrinterPhase, string> = {
  sending: 'Envoi de votre demande',
  printing: 'Impression du récapitulatif',
  done: 'Demande enregistrée',
};

/**
 * Petite imprimante à tickets : confirmation tactile du formulaire de contact.
 * L'écran affiche l'état de l'envoi ; une fois le message parti, un ticket
 * récapitulatif sort de la fente. Le ticket est du vrai texte (lisible par
 * les lecteurs d'écran) ; l'état est annoncé via une région live.
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

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Corps de l'imprimante */}
      <div className="relative z-10 rounded-[1.75rem] border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.04] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_30px_60px_-30px_rgba(3,6,15,0.9)] backdrop-blur-xl">
        {/* Écran d'état */}
        <div
          className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-navy/90 px-4 font-mono text-xs text-white/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            {phase === 'done' ? (
              <motion.span
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="text-emerald-400"
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
              className="truncate"
            >
              {STATUS[phase]}
              {phase !== 'done' && '…'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Fente de sortie */}
        <div className="mx-3 mt-5 h-2.5 rounded-full bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Ticket — glisse hors de la fente (le haut est masqué sous l'imprimante) */}
      <div className="relative -mt-3 overflow-hidden px-7 pb-2">
        {receipt && phase !== 'sending' && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: '-100%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%' }}
            transition={reduce ? { duration: 0.3 } : { duration: FEED_S, ease: [0.45, 0, 0.2, 1] }}
            onAnimationComplete={onPrinted}
          >
            <ReceiptPaper receipt={receipt} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ReceiptPaper({ receipt }: { receipt: Receipt }) {
  const date = receipt.date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = receipt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="receipt-paper bg-mist px-5 pb-8 pt-6 font-mono text-[11px] leading-relaxed text-ink"
      aria-label="Récapitulatif de votre demande"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em]">Kaylow Sphere</p>
      <p className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-ink/80">
        Récapitulatif de demande
      </p>

      <Dashed />
      <Row label="N°" value={receipt.ref} />
      <Row label="Date" value={`${date} · ${time}`} />
      <Dashed />
      <Row label="Nom" value={receipt.name} />
      <Row label="Projet" value={receipt.projectType} />
      <Dashed />
      <Row label="Réponse" value="sous 48 h ouvrées" strong />
      <Row label="Devis" value="gratuit" />
      <Dashed />

      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-ink/80">
        Merci pour votre confiance
      </p>
      {/* Code-barres décoratif */}
      <div aria-hidden="true" className="receipt-barcode mx-auto mt-3 h-8 w-4/5" />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-ink/80">{label}</span>
      <span className={`truncate text-right ${strong ? 'font-semibold' : ''}`}>{value}</span>
    </p>
  );
}

function Dashed() {
  return <hr aria-hidden="true" className="my-3 border-0 border-t border-dashed border-ink/30" />;
}
