import { ProductMedia } from "@/components/product/product-media";
import { getBlogPost, getBlogPosts } from "@/lib/api";
import { formatDateLong } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [{ url: post.cover }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);
  if (!post) return notFound();

  const blogPosts = await getBlogPosts();
  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-190 px-5 py-10 lg:py-14">
      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
        <Link href="/blog" className="link-underline">
          Journal
        </Link>{" "}
        / {post.category}
      </p>
      <h1 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
        {formatDateLong(post.date)} · {post.readTime} de lecture
      </p>

      <ProductMedia
        src={post.cover}
        alt={post.title}
        priority
        className="my-8 aspect-video rounded-xl"
      />

      <div
        className="space-y-5 text-[1.05rem] leading-relaxed"
        style={{ color: "var(--ink)" }}
      >
        <p>{post.excerpt}</p>
        <p style={{ color: "var(--ink-soft)" }}>
          Dans cet atelier, le rythme reste dicté par la main plutôt que par la
          machine. Les gestes se transmettent en observant, en refaisant, en
          corrigeant, sur des mois parfois des années avant qu'une pièce ne soit
          jugée prête à porter le nom de l'atelier.
        </p>
        <p style={{ color: "var(--ink-soft)" }}>
          C'est cette lenteur assumée que M&H Store choisit de mettre en avant :
          chaque objet a une histoire de matière, de lieu et de personne, plutôt
          qu'une simple référence de catalogue.
        </p>
        <blockquote
          className="border-l-2 pl-5 italic"
          style={{ borderColor: "var(--coral)", color: "var(--ink-soft)" }}
        >
          « Le geste ne s'apprend pas dans un livre, il se transmet à la main. »
          — un artisan partenaire
        </blockquote>
        <p style={{ color: "var(--ink-soft)" }}>
          Nous continuerons à documenter ces ateliers au fil des mois, avec
          l'objectif de rendre visible le travail qui se cache derrière chaque
          objet de la boutique.
        </p>
      </div>

      <div
        className="mt-14 border-t pt-10"
        style={{ borderColor: "var(--line)" }}
      >
        <p className="eyebrow mb-5">À lire aussi</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {others.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <ProductMedia
                src={p.cover}
                alt={p.title}
                className="aspect-4/3 rounded-xl"
              />
              <h3 className="link-underline mt-3 font-display text-lg leading-snug">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
