import type { FaqItem } from '@/lib/site';

/**
 * Questions fréquentes en accordéon natif (<details>) : accessible au clavier
 * et aux lecteurs d'écran, fonctionne sans JavaScript.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item) => (
        <details key={item.q} className="faq-item group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-white/90 transition-colors hover:text-white">
            {item.q}
            <span
              aria-hidden="true"
              className="relative h-4 w-4 shrink-0 text-accent before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
            />
          </summary>
          <p className="pb-5 pr-10 text-sm leading-relaxed text-white/65">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
