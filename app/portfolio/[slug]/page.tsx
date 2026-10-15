import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import CtaBand from '@/components/CtaBand';
import { ProjectGallery } from '@/components/ProjectMedia';
import { Section } from '@/components/Section';
import { projects } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project)
    return pageMetadata({
      title: 'Projet introuvable',
      description: '',
      path: `/portfolio/${slug}`,
      noindex: true,
    });

  return pageMetadata({
    title: `${project.name} — Réalisation`,
    description: `${project.name} : ${project.tagline} Contexte, solution et points clés. Stack : ${project.stack.join(', ')}.`,
    path: `/portfolio/${project.slug}`,
    type: 'article',
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Section className="aura">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-white/60 transition-all hover:gap-3 hover:text-accent"
        >
          <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-180" />
          Portfolio
        </Link>

        <header className="mt-10 max-w-4xl">
          <p className="eyebrow mb-5">
            <span
              className="h-px w-10 bg-gradient-to-r from-accent to-transparent"
              aria-hidden="true"
            />
            <span>{project.type}</span>
          </p>
          <h1 className="font-heading text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[1.0] tracking-[-0.04em]">
            {project.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/65">{project.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/70"
              >
                {tech}
              </span>
            ))}
            {project.status && (
              <span className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                {project.status}
              </span>
            )}
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="link-arrow mt-6">
              Voir le projet en ligne
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
        </header>

        <ProjectGallery project={project} />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl">Le besoin</h2>
            <p className="mt-3 prose-light">{project.context}</p>
          </div>
          <div>
            <h2 className="text-xl">La solution</h2>
            <p className="mt-3 prose-light">{project.solution}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl">Points clés</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75"
              >
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <Link
            href={`/portfolio/${next.slug}`}
            className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-accent"
          >
            Projet suivant
            <span className="font-heading font-semibold text-white group-hover:text-accent">
              {next.name}
            </span>
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
