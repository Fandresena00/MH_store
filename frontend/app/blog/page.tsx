import { ProductMedia } from "@/components/product/product-media";
import { getBlogPosts } from "@/lib/api";
import { formatDateLong } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Le journal",
  description:
    "Reportages et carnets sur l'artisanat malgache et les mains qui le font vivre.",
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const [first, ...rest] = blogPosts;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-10 lg:py-14">
      <div className="text-center">
        <p className="eyebrow">Le journal</p>
        <h1 className="mt-2 font-display text-4xl">
          Matières, gestes et ateliers
        </h1>
        <p
          className="mx-auto mt-3 max-w-md text-sm"
          style={{ color: "var(--ink-soft)" }}
        >
          Reportages et carnets sur l'artisanat malgache et les mains qui le
          font vivre.
        </p>
      </div>

      {/* --------------------------------------------------------------- FEATURED */}
      <Link
        href={`/blog/${first.slug}`}
        className="group mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10"
      >
        <ProductMedia
          src={first.cover}
          alt={first.title}
          className="aspect-[4/3] rounded-xl"
        />
        <div className="flex flex-col justify-center">
          <p className="eyebrow">{first.category}</p>
          <h2 className="link-underline mt-2 font-display text-3xl leading-snug">
            {first.title}
          </h2>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            {first.excerpt}
          </p>
          <p className="mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
            {formatDateLong(first.date)} · {first.readTime} de lecture
          </p>
        </div>
      </Link>

      <div className="divider-stitch my-14" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <ProductMedia
              src={post.cover}
              alt={post.title}
              className="aspect-[4/3] rounded-xl"
            />
            <p className="mt-4 eyebrow">{post.category}</p>
            <h3 className="link-underline mt-1.5 font-display text-xl leading-snug">
              {post.title}
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              {post.excerpt}
            </p>
            <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
              {formatDateLong(post.date)} · {post.readTime}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
