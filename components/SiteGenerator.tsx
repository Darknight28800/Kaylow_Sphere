'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { EXAMPLES } from './generator/examples';

type Status = 'idle' | 'loading' | 'done' | 'error';

const MAX_LEN = 600;

const LOADING_STEPS = [
  'Lecture du brief…',
  'Choix de la palette et de la typo…',
  'Composition de la mise en page…',
  'Intégration HTML / CSS…',
  'Derniers ajustements…',
];

const DEFAULT_PALETTE = ['#22303C', '#6366F1', '#F5F3EF'];

export default function SiteGenerator() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [html, setHtml] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [colors, setColors] = useState<string[]>(DEFAULT_PALETTE);

  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Messages de chargement progressifs
  useEffect(() => {
    if (status !== 'loading') return;
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 3200);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status]);

  const loadExample = useCallback((text: string) => {
    setPrompt(text);
    setStatus((s) => (s === 'error' ? 'idle' : s));
    setError('');
    textareaRef.current?.focus();
  }, []);

  const outOfCredits = remaining === 0;

  const setColorAt = (i: number, v: string) =>
    setColors((cs) => cs.map((c, j) => (j === i ? v : c)));
  const addColor = () => setColors((cs) => (cs.length < 4 ? [...cs, '#888888'] : cs));
  const removeColor = (i: number) =>
    setColors((cs) => (cs.length > 2 ? cs.filter((_, j) => j !== i) : cs));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading' || outOfCredits) return;

    const form = e.currentTarget;
    const honeypot = new FormData(form).get('website');
    if (honeypot) return;

    const brief = prompt.trim();
    if (brief.length < 12) {
      setStatus('error');
      setError('Décrivez votre projet en une phrase au moins.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: brief,
          ...(useCustomColors ? { colors } : {}),
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        html?: string;
        remaining?: number;
        error?: string;
      } | null;

      if (!res.ok || !body?.html) {
        throw new Error(body?.error ?? 'La génération a échoué. Réessayez dans un instant.');
      }

      setHtml(body.html);
      setRemaining(typeof body.remaining === 'number' ? body.remaining : null);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'La génération a échoué.');
    }
  }

  return (
    <div className="space-y-8">
      {/* Exemples par secteur */}
      <div>
        <p className="eyebrow mb-4">
          <span className="h-px w-8 bg-white/15" aria-hidden="true" />
          <span>Exemples</span>
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => loadExample(ex.prompt)}
                className="glass group flex h-full w-full flex-col items-start gap-2 p-4 text-left transition-colors hover:border-accent/50"
              >
                <span className="flex items-center gap-2">
                  {ex.swatches.map((c) => (
                    <span
                      key={c}
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-white/15"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <span className="font-heading text-sm font-semibold text-white">{ex.sector}</span>
                <span className="text-xs text-white/55">{ex.vibe}</span>
                <span className="link-arrow mt-1 text-[11px] group-hover:gap-2">
                  Utiliser cet exemple
                  <Icon name="arrow-right" className="h-3 w-3" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Champ éditable */}
      <form onSubmit={handleSubmit} noValidate className="glass-panel space-y-4">
        <div>
          <label htmlFor="brief" className="mb-1.5 block text-sm font-medium text-white/80">
            Décrivez votre projet <span className="text-accent">*</span>
          </label>
          <textarea
            id="brief"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_LEN))}
            rows={5}
            placeholder="Secteur, ambiance recherchée, couleurs, ce qu'il faut mettre en avant…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-accent"
          />
          <div className="mt-1 flex justify-between text-xs text-white/60">
            <span>Un aperçu = une page d&apos;accueil (header, palette, 3-4 blocs).</span>
            <span>
              {prompt.length}/{MAX_LEN}
            </span>
          </div>
        </div>

        {/* Palette : automatique ou choisie par le visiteur */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-white/80">
            <input
              type="checkbox"
              checked={useCustomColors}
              onChange={(e) => setUseCustomColors(e.target.checked)}
              className="h-4 w-4 rounded border-white/25 bg-navy accent-brand"
            />
            Je choisis mes couleurs
          </label>

          {!useCustomColors ? (
            <p className="mt-1.5 text-xs text-white/60">
              Sinon, la palette est choisie selon le secteur et l&apos;ambiance décrits.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] py-1.5 pl-1.5 pr-2"
                  >
                    <input
                      type="color"
                      value={c}
                      onChange={(e) => setColorAt(i, e.target.value)}
                      aria-label={`Couleur ${i + 1}`}
                      className="h-7 w-7 cursor-pointer rounded-md border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs uppercase text-white/60">{c}</span>
                    {colors.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeColor(i)}
                        aria-label={`Retirer la couleur ${i + 1}`}
                        className="text-base leading-none text-white/60 hover:text-white/80"
                      >
                        &times;
                      </button>
                    )}
                  </span>
                ))}
                {colors.length < 4 && (
                  <button
                    type="button"
                    onClick={addColor}
                    className="inline-flex items-center rounded-lg border border-dashed border-white/20 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-white/60 hover:border-accent/50 hover:text-accent"
                  >
                    + Couleur
                  </button>
                )}
              </div>
              <p className="text-xs text-white/60">
                2 à 4 couleurs — elles priment sur toute couleur écrite dans le brief.
              </p>
            </div>
          )}
        </div>

        {/* Honeypot */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Site web</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status === 'error' && (
          <p
            className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading' || outOfCredits}
          >
            {status === 'loading'
              ? 'Génération…'
              : status === 'done'
                ? 'Régénérer'
                : 'Générer mon aperçu'}
            {status !== 'loading' && <Icon name="arrow-right" className="h-4 w-4" />}
          </button>

          {remaining !== null && (
            <span className="font-mono text-xs text-white/60">
              {outOfCredits
                ? 'Essais gratuits épuisés'
                : `${remaining} essai${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`}
            </span>
          )}
        </div>
      </form>

      {/* Chargement */}
      {status === 'loading' && (
        <div className="glass-panel" role="status" aria-live="polite">
          <div className="beam-loader mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <span className="beam-loader__fill" />
          </div>
          <p className="font-mono text-sm text-accent">{LOADING_STEPS[step]}</p>
          <p className="mt-1 text-xs text-white/60">
            Comptez une trentaine de secondes : le HTML est écrit ligne à ligne.
          </p>
        </div>
      )}

      {/* Résultat */}
      {status === 'done' && html && (
        <div ref={resultRef} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">
              <span className="h-px w-8 bg-white/15" aria-hidden="true" />
              <span>Aperçu — page d&apos;accueil</span>
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="link-arrow text-[11px]"
            >
              {expanded ? 'Réduire' : 'Agrandir'}
              <Icon name="arrow-right" className="h-3 w-3" />
            </button>
          </div>

          {/* z-[31] : passe au-dessus du champ de particules (fixed, z-30) —
              l'aperçu doit être parfaitement opaque, comme une vraie fenêtre. */}
          <div className="relative z-[31] overflow-hidden rounded-2xl border border-white/10 bg-navy-800 p-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[10px] text-white/60">aperçu.html</span>
            </div>
            <iframe
              title="Aperçu de maquette généré"
              srcDoc={html}
              sandbox="allow-scripts"
              className={`block w-full rounded-xl border-0 bg-white transition-[height] duration-300 ${
                expanded ? 'h-[85vh]' : 'h-[70vh] min-h-[520px]'
              }`}
            />
          </div>

          <p className="text-xs text-white/60">
            Maquette générée automatiquement à titre d&apos;illustration : une seule page, contenu
            fictif, pas de sous-pages ni de fonctionnalités. Un vrai projet est conçu sur mesure.
          </p>

          {/* CTA final */}
          <div className="glass glass-sheen relative overflow-hidden p-6 sm:p-8">
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <h3 className="text-xl">Envie d&apos;aller plus loin ?</h3>
                <p className="mt-2 text-sm prose-light">
                  Cet aperçu donne le ton. Parlons de votre vrai projet : contenu, fonctionnalités,
                  identité, référencement.
                </p>
              </div>
              <Link href="/contact" className="btn-primary shrink-0">
                Demander un devis
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
