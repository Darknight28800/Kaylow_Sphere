import Image from 'next/image';
import type { Project, ProjectImage } from '@/lib/site';

const HALO =
  'radial-gradient(50% 50% at 50% 40%, rgba(91,61,246,0.28), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgba(61,107,245,0.16), transparent 70%)';

export const isPortrait = (img?: ProjectImage) =>
  !!img?.width && !!img.height && img.height > img.width;

/** Visuel vertical affiché en entier ; son propre flou comble l'espace restant. */
function PortraitFill({
  image,
  sizes,
  priority,
}: {
  image: ProjectImage;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={image.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="200px"
        className="scale-125 object-cover opacity-50 blur-2xl"
      />
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain"
      />
    </>
  );
}

/**
 * Vignette pour les cartes de la liste portfolio et de l'accueil.
 * `tall` : carte verticale (accueil) — la vignette prend toute la hauteur disponible.
 */
export function ProjectThumb({
  project,
  className = '',
  tall = false,
}: {
  project: Project;
  className?: string;
  tall?: boolean;
}) {
  const cover = project.images?.[0];
  const portrait = isPortrait(cover);
  const shape = tall ? 'aspect-[9/16] md:aspect-auto md:min-h-0 md:flex-1' : 'aspect-[16/10]';
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${shape} ${className}`}
    >
      {cover && portrait ? (
        <PortraitFill image={cover} sizes="(max-width: 768px) 100vw, 560px" />
      ) : cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: HALO }}
        >
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
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: HALO }}
        >
          <span className="font-mono text-sm text-white/60">Captures d&apos;écran à venir</span>
        </div>
      </div>
    );
  }

  const [first, ...rest] = images;

  return (
    <div className="mt-12 space-y-4">
      {isPortrait(first) ? (
        // Visuel vertical : affiché en entier, hauteur limitée à l'écran, sur son propre flou.
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 sm:py-10">
          <Image
            src={first.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="200px"
            className="scale-125 object-cover opacity-40 blur-3xl"
          />
          <Image
            src={first.src}
            alt={first.alt}
            width={first.width}
            height={first.height}
            priority
            sizes="(max-width: 640px) 90vw, 420px"
            className="relative mx-auto h-auto max-h-[78vh] w-auto rounded-xl shadow-2xl shadow-black/60"
          />
        </div>
      ) : (
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
      )}
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
