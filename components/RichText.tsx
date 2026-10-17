import Link from 'next/link';
import { Fragment } from 'react';

/**
 * Texte avec liens au format [texte](/chemin) ou [texte](https://…).
 * Liens internes → <Link>, externes → nouvel onglet.
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const [, label, href] = m;
        return href.startsWith('/') ? (
          <Link key={i} href={href} className="link-accent">
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noreferrer" className="link-accent">
            {label}
          </a>
        );
      })}
    </>
  );
}
