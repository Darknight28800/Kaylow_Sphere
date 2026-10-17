'use client';

import { useState, type FormEvent } from 'react';
import Icon from './Icon';

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-accent';

const GOALS = [
  'Recevoir plus de demandes',
  'Être mieux trouvé sur Google',
  'Moderniser mon site',
  'Mon site est lent ou mal affiché sur téléphone',
  'Je ne sais pas, je veux un avis',
];

/**
 * Demande d'audit gratuit. Passe par /api/contact (mêmes protections :
 * origine, quotas, validation, honeypot) avec le type « Audit gratuit ».
 */
export default function AuditForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get('company')) {
      setStatus('success');
      form.reset();
      return;
    }
    if (!data.get('consent')) {
      setStatus('error');
      setErrorMsg('Merci de cocher la case de consentement pour que je puisse vous répondre.');
      return;
    }
    const url = String(data.get('url') ?? '').trim();
    const noSite = Boolean(data.get('noSite'));
    if (!url && !noSite) {
      setStatus('error');
      setErrorMsg('Indiquez l’adresse de votre site, ou cochez « Je n’ai pas encore de site ».');
      return;
    }

    const message = [
      `Site à auditer : ${noSite ? 'pas encore de site' : url}`,
      `Activité : ${String(data.get('activity') ?? '').trim() || 'non précisée'}`,
      `Objectif : ${data.get('goal')}`,
      `Téléphone : ${String(data.get('phone') ?? '').trim() || 'non communiqué'}`,
    ].join('\n');

    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          projectType: 'Audit gratuit',
          message,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "L'envoi a échoué.");
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : "L'envoi a échoué.");
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-panel text-center" role="status">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-xl">Demande reçue !</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
          Je vous envoie votre audit sous 48 h ouvrées, par e-mail. Pensez à vérifier vos spams.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white/80">
              Nom <span className="text-accent">*</span>
            </label>
            <input id="name" name="name" required autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
              E-mail <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-white/80">
            Adresse de votre site
          </label>
          <input
            id="url"
            name="url"
            inputMode="url"
            placeholder="ex. www.mon-entreprise.fr"
            className={inputClass}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              name="noSite"
              className="h-4 w-4 rounded border-white/25 bg-navy accent-brand"
            />
            Je n&apos;ai pas encore de site (je vous conseille sur la meilleure façon de démarrer)
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="activity" className="mb-1.5 block text-sm font-medium text-white/80">
              Votre activité
            </label>
            <input
              id="activity"
              name="activity"
              placeholder="ex. plombier à Chartres"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white/80">
              Téléphone (facultatif)
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="goal" className="mb-1.5 block text-sm font-medium text-white/80">
            Votre objectif principal
          </label>
          <select
            id="goal"
            name="goal"
            defaultValue={GOALS[0]}
            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent"
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Honeypot — masqué aux humains */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="company">Société</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 rounded border-white/25 bg-navy accent-brand"
          />
          <span>
            J&apos;accepte que ces informations soient utilisées pour réaliser l&apos;audit et me
            recontacter à ce sujet. <span className="text-accent">*</span>
          </span>
        </label>

        {status === 'error' && (
          <p
            className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200"
            role="alert"
          >
            {errorMsg}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi en cours…' : 'Recevoir mon audit gratuit'}
          {status !== 'sending' && <Icon name="arrow-right" className="h-4 w-4" />}
        </button>
        <p className="text-center text-xs text-white/50">
          Gratuit, sans engagement, aucun accès à votre site n&apos;est nécessaire.
        </p>
      </form>
    </div>
  );
}
