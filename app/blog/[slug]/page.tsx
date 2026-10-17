import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/CtaBand';
import Icon from '@/components/Icon';
import RichText from '@/components/RichText';
import { Section } from '@/components/Section';
import { posts } from '@/lib/blog';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post)
    return pageMetadata({
      title: 'Article introuvable',
      description: '',
      path: `/blog/${slug}`,
      noindex: true,
    });
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: 'fr-FR',
    author: { '@type': 'Person', name: site.legalName },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Section className="aura">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-white/60 transition-all hover:gap-3 hover:text-accent"
          >
            <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-180" />
            Blog
          </Link>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {post.category} · {formatDate(post.date)} · {post.readingMinutes} min de lecture
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/75">{post.intro}</p>

          {post.sections.map((s) => (
            <section key={s.h2} className="mt-12">
              <h2 className="font-heading text-2xl font-semibold">{s.h2}</h2>
              {s.paragraphs?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-4 leading-relaxed text-white/75">
                  <RichText text={para} />
                </p>
              ))}
              {s.list && (
                <ul className="mt-5 space-y-3">
                  {s.list.map((item) => (
                    <li key={item.slice(0, 40)} className="flex gap-3 text-white/75">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span>
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="glass-panel mt-14">
            <p className="font-heading text-lg font-semibold text-white">
              Et votre site, il en est où ?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Recevez gratuitement l’audit de votre site sous 48 h : vitesse, mobile, référencement,
              et vos 3 priorités.
            </p>
            <Link href="/audit-gratuit" className="btn-primary mt-5">
              Audit gratuit de mon site
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          {post.sources && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                Sources
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {post.sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noreferrer" className="link-accent">
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </Section>

      <Section className="!pt-0">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">
            À lire aussi
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/blog/${o.slug}`} className="glass-panel group">
                <p className="text-sm font-medium leading-snug text-white transition-colors group-hover:text-accent">
                  {o.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
