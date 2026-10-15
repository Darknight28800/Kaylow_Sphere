'use client';

import { useState, type FormEvent } from 'react';
import Icon from './Icon';

type Status = 'idle' | 'sending' | 'success' | 'error';

const PROJECT_TYPES = [
  'Site vitrine',
  'Application web sur mesure',
  'Maintenance / évolutions',
  'Autre / je ne sais pas encore',
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-spam : champ masqué, rempli uniquement par les robots.
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

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          projectType: data.get('projectType'),
          message: data.get('message'),
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
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "L'envoi a échoué. Vous pouvez aussi m'écrire directement par e-mail.",
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-panel">
        <div className="flex flex-col items-start gap-4 py-6" role="status">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-accent">
            <Icon name="check" className="h-6 w-6" />
          </span>
          <h2 className="text-xl">Message envoyé, merci.</h2>
          <p className="prose-light">
            Votre demande est bien arrivée. Je reviens vers vous sous 48 h ouvrées. Pensez à vérifier
            vos spams si vous ne recevez rien.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom" name="name" required autoComplete="name" />
          <Field
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div>
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-white/80">
            Type de projet
          </label>
          <select
            id="projectType"
            name="projectType"
            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-accent"
            defaultValue={PROJECT_TYPES[0]}
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white/80">
            Votre message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            minLength={10}
            placeholder="Votre activité, l'objectif du projet, un délai éventuel, un lien de référence…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-accent"
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
            J&apos;accepte que ces informations soient utilisées pour me recontacter au sujet de ma
            demande. <span className="text-accent">*</span>
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
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
          {status !== 'sending' && <Icon name="arrow-right" className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'email' | 'text';
}

function Field({ label, name, type = 'text', required, autoComplete, inputMode }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-accent"
      />
    </div>
  );
}
