import { ProductCard } from "@/components/product/product-card";
import { ProductMedia } from "@/components/product/product-media";
import {
  getBlogPosts,
  getCategories,
  getFeaturedProducts,
  getProducts,
} from "@/lib/api";
import { formatDateLong } from "@/lib/utils";
import {
  RiArrowRightLine,
  RiHandCoinLine,
  RiLeafLine,
  RiTruckLine,
} from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Découvrez la boutique en ligne M&H Store : raphia d'Ambalavao, bois d'Ambositra, teintures végétales d'Antsirabe — des objets artisanaux malgaches choisis pour leur matière et leur histoire.",
};

export default async function HomePage() {
  const [products, categories, blogPosts, featured] = await Promise.all([
    getProducts(),
    getCategories(),
    getBlogPosts(),
    getFeaturedProducts(),
  ]);
  const bestsellers = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--sand)" }}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Fait main à Madagascar</p>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] tracking-tight sm:text-[3.4rem] lg:text-[3.9rem]">
              Des objets qui portent
              <span className="italic" style={{ color: "var(--coral)" }}>
                {" "}
                une main
              </span>
              , pas une usine.
            </h1>
            <p
              className="mt-6 max-w-md text-[1.05rem] leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              Raphia d'Ambalavao, bois d'Ambositra, teintures végétales
              d'Antsirabe : chaque pièce M&H Store est choisie pour sa matière,
              son atelier et l'histoire qu'elle raconte chez vous.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/boutique"
                className="btn-primary flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
              >
                Découvrir la boutique <RiArrowRightLine size={16} />
              </Link>
              <Link
                href="/a-propos"
                className="link-underline text-sm font-medium"
              >
                Notre histoire
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 divider-stitch pt-6">
              {[
                { icon: RiLeafLine, label: "Matières naturelles" },
                { icon: RiHandCoinLine, label: "Commerce équitable" },
                { icon: RiTruckLine, label: "Expédié sous 48h" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{ color: "var(--ink-soft)" }}
                >
                  <Icon size={16} style={{ color: "var(--teal)" }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <ProductMedia
              src=""
              alt="Sélection d'objets artisanaux malgaches"
              priority
              className="col-span-2 aspect-[16/10] rounded-xl shadow-[var(--shadow-lift)] sm:aspect-[16/9]"
            />
            <ProductMedia
              src=""
              alt="Panier tressé en raphia"
              className="aspect-square rounded-xl"
            />
            <ProductMedia
              src=""
              alt="Cabas en cuir et raphia"
              className="aspect-square rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Parcourir</p>
            <h2 className="mt-2 font-display text-3xl">
              Trois univers, une même exigence
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/boutique?categorie=${cat.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl p-6"
            >
              <ProductMedia
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <div className="relative text-white">
                <h3 className="font-display text-2xl">{cat.name}</h3>
                <p className="link-underline mt-1 text-sm opacity-90">
                  {cat.count} pièces
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- NOUVEAUTÉS */}
      <section className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">Sélection</p>
              <h2 className="mt-2 font-display text-3xl">
                Nouveautés &amp; éditions limitées
              </h2>
            </div>
            <Link
              href="/boutique?tri=nouveautes"
              className="link-underline hidden text-sm font-medium sm:block"
            >
              Voir les nouveautés
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- STORY */}
      <section
        style={{ background: "var(--teal-deep)", color: "var(--paper)" }}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-20 lg:grid-cols-2 lg:px-10">
          <ProductMedia
            src=""
            alt="Artisan au travail dans un atelier malgache"
            className="aspect-[4/5] rounded-xl order-2 lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <p className="eyebrow" style={{ color: "var(--coral)" }}>
              Notre engagement
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              Chaque achat rémunère l'atelier au juste prix, pas
              l'intermédiaire.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-85">
              M&H Store travaille en direct avec neuf ateliers à travers
              Madagascar. Pas de sous-traitance en cascade : nous connaissons
              chaque tisserande, chaque sculpteur, et nous les payons avant même
              la mise en vente.
            </p>
            <Link
              href="/a-propos"
              className="mt-7 inline-flex items-center gap-2 link-underline text-sm font-semibold"
            >
              Rencontrer les ateliers <RiArrowRightLine size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ BESTSELLERS */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Les préférés</p>
            <h2 className="mt-2 font-display text-3xl">Les incontournables</h2>
          </div>
          <Link
            href="/boutique?tri=populaire"
            className="link-underline hidden text-sm font-medium sm:block"
          >
            Voir les incontournables
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ JOURNAL */}
      <section
        className="border-t"
        style={{ borderColor: "var(--line)", background: "var(--sand)" }}
      >
        <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">Le journal</p>
              <h2 className="mt-2 font-display text-3xl">
                Matières, gestes et ateliers
              </h2>
            </div>
            <Link
              href="/blog"
              className="link-underline hidden text-sm font-medium sm:block"
            >
              Tous les articles
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <ProductMedia
                  src={post.cover}
                  alt={post.title}
                  className="aspect-[4/3] rounded-xl"
                />
                <p className="mt-4 eyebrow">{post.category}</p>
                <h3 className="link-underline mt-1.5 font-display text-lg leading-snug">
                  {post.title}
                </h3>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {formatDateLong(post.date)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- NEWSLETTER */}
      <section className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center lg:px-10">
          <h2 className="font-display text-3xl">
            Un objet, une histoire, chaque mois
          </h2>
          <p
            className="mx-auto mt-3 max-w-md text-sm"
            style={{ color: "var(--ink-soft)" }}
          >
            Recevez en avant-première nos nouvelles collections et les portraits
            d'ateliers.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Votre adresse email"
              className="field-input h-12 flex-1 rounded-full"
            />
            <button
              type="submit"
              className="btn-primary px-6 text-sm font-semibold"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
