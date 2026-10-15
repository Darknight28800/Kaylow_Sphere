import Image from 'next/image';
import type { Project } from '@/lib/site';

const HALO =
  'radial-gradient(50% 50% at 50% 40%, rgba(91,61,246,0.28), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgba(34,211,238,0.14), transparent 70%)';

/** Vignette pour les cartes de la liste portfolio et de l'accueil. */
export function ProjectThumb({ project, className = '' }: { project: Project; className?: string }) {
  const cover = project.images?.[0];
  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ background: HALO }}>
          <span className="font-heading text-lg font-semibold text-white/60">{project.name}</span>
        </div>
      )}
    </div>
  );
}

/** Galerie de la page détail projet. Placeholder tant qu'aucune capture n'est fournie. */
export function ProjectGallery({ project }: { project: Project }) {
  const images = project.images ?? [];

  if (images.length === 0) {
    return (
      <div
        className="mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        role="img"
        aria-label={`Aperçu du projet ${project.name} — captures d'écran à venir`}
      >
        <div className="flex h-full w-full items-center justify-center" style={{ background: HALO }}>
          <span className="font-mono text-sm text-white/60">Captures d&apos;écran à venir</span>
        </div>
      </div>
    );
  }

  const [first, ...rest] = images;

  return (
    <div className="mt-12 space-y-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Image
          src={first.src}
          alt={first.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
      </div>
      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 450px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
