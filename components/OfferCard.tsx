import Link from 'next/link';
import Icon from './Icon';
import type { Offer } from '@/lib/site';

/**
 * Montant à la française, espace insécable tous les 3 chiffres — y compris pour
 * 4 chiffres (« 1 200 »), qu'Intl fr-FR ne groupe pas : une fourchette
 * « 700 – 1200 » côtoierait sinon « 2 000 – 3 500 ».
 */
const euro = {
  format: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'),
};

/** Carte d'une formule tarifaire (page /tarifs). */
export default function OfferCard({ offer, compact = false }: { offer: Offer; compact?: boolean }) {
  return (
    <article
      className={`glass-panel glass-sheen relative flex h-full flex-col ${
        compact ? 'p-6' : 'p-7'
      } ${
        offer.highlight
          ? 'border-brand/50 shadow-[0_0_0_1px_rgba(91,61,246,0.35),0_30px_60px_-30px_rgba(91,61,246,0.55)]'
          : ''
      }`}
    >
      {offer.highlight && (
        <span className="absolute right-5 top-5 rounded-full border border-brand-400/50 bg-brand/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
          Recommandé
        </span>
      )}

      <h3 className="pr-24 text-lg">{offer.name}</h3>

      <div className="mt-4 min-h-[3.75rem]">
        {offer.price === null ? (
          <p className="pt-[15px] font-heading text-3xl font-bold tracking-[-0.03em] text-white">
            Sur devis
          </p>
        ) : (
          <>
            {/* Ligne réservée même sans « à partir de » : prix alignés d'une carte à l'autre */}
            <p
              aria-hidden={!offer.from}
              className={`font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 ${
                offer.from ? '' : 'invisible'
              }`}
            >
              À partir de
            </p>
            <p className="font-heading font-bold tracking-[-0.03em] text-white">
              <span className={offer.priceMax || compact ? 'text-3xl' : 'text-4xl'}>
                {euro.format(offer.price)}
                {offer.priceMax && (
                  <>
                    <span className="mx-1.5 font-normal text-white/40">–</span>
                    {euro.format(offer.priceMax)}
                  </>
                )}
              </span>
              <span className="ml-1 text-xl text-white/80">€</span>
              {offer.per && (
                <span className="ml-1.5 font-sans text-sm font-medium text-white/55">
                  {offer.per}
                </span>
              )}
            </p>
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/65">{offer.pitch}</p>

      <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
        {offer.includes.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-white/75">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {offer.delay && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
            Délai · {offer.delay}
          </p>
        )}
        {!compact && (
          <Link
            href="/contact"
            className={`${offer.highlight ? 'btn-primary' : 'btn-outline'} w-full`}
          >
            {offer.price === null ? 'Décrire mon projet' : 'Demander un devis'}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
