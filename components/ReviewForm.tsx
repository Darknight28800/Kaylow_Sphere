'use client';

import { useState, type FormEvent } from 'react';
import Icon from './Icon';

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-accent';

const LABELS = ['Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];

/**
 * Formulaire de dépôt d'avis. L'avis part par e-mail pour modération : rien
 * n'est publié automatiquement.
 */
export default function ReviewForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!rating) {
      setStatus('error');
      setErrorMsg('Choisissez une note de 1 à 5 étoiles.');
      return;
    }
    if (!data.get('consent')) {
      setStatus('error');
      setErrorMsg('Merci d’accepter la publication de votre avis.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          role: data.get('role'),
          rating,
          text: data.get('text'),
          consent: true,
          company: data.get('company'),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "L'envoi a échoué.");
      }
      setStatus('success');
      form.reset();
      setRating(0);
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
        <h2 className="mt-5 text-xl">Merci pour votre avis !</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
          Il m&apos;a bien été transmis. Je le lis personnellement avant de le publier sur le site.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="link-arrow mt-6">
          Déposer un autre avis
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Note */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-white/80">
            Votre note <span className="text-accent">*</span>
          </legend>
          <div className="flex items-center gap-4">
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="cursor-pointer rounded-md p-0.5 focus-within:ring-2 focus-within:ring-accent"
                  onMouseEnter={() => setHover(n)}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={n}
                    checked={rating === n}
                    onChange={() => setRating(n)}
                    className="sr-only"
                  />
                  <span className="sr-only">
                    {n} étoile{n > 1 ? 's' : ''} — {LABELS[n - 1]}
                  </span>
                  <Icon
                    name="star"
                    className={`h-8 w-8 transition-transform duration-150 hover:scale-110 ${
                      n <= shown ? 'fill-current text-[#f5c451]' : 'text-white/25'
                    }`}
                  />
                </label>
              ))}
            </div>
            <span
              className="font-mono text-xs uppercase tracking-[0.16em] text-white/55"
              aria-hidden="true"
            >
              {shown ? LABELS[shown - 1] : ''}
            </span>
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white/80">
              Prénom et nom <span className="text-accent">*</span>
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
            <p className="mt-1.5 text-xs text-white/45">Jamais publié.</p>
          </div>
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-white/80">
            Entreprise, association ou métier
          </label>
          <input
            id="role"
            name="role"
            placeholder="Ex. Plomberie Martin, Comité des fêtes de…"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="text" className="mb-1.5 block text-sm font-medium text-white/80">
            Votre avis <span className="text-accent">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            required
            rows={5}
            minLength={20}
            maxLength={1500}
            placeholder="Comment s'est passé le projet ? Qu'avez-vous apprécié ?"
            className={inputClass}
          />
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
            J&apos;accepte que mon avis soit publié sur ce site avec mon prénom, l&apos;initiale de
            mon nom et ma structure. <span className="text-accent">*</span>
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
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer mon avis'}
          {status !== 'sending' && <Icon name="arrow-right" className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
