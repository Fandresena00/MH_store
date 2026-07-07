import { MobileFilters } from "@/components/boutique/mobile-filters";
import { SortSelect } from "@/components/boutique/sort-select";
import { ProductCard } from "@/components/product/product-card";
import { categories, products } from "@/lib/data";
import { RiSearchLine } from "@remixicon/react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Toute la sélection M&H Store : vannerie, textiles et accessoires artisanaux malgaches.",
};

const PRICE_RANGES = [
  {
    id: "0-50000",
    label: "Moins de 50 000 Ar",
    test: (p: number) => p < 50000,
  },
  {
    id: "50000-100000",
    label: "50 000 – 100 000 Ar",
    test: (p: number) => p >= 50000 && p <= 100000,
  },
  {
    id: "100000+",
    label: "Plus de 100 000 Ar",
    test: (p: number) => p > 100000,
  },
];

export default function BoutiquePage({
  searchParams,
}: {
  searchParams: { categorie?: string; q?: string; tri?: string; prix?: string };
}) {
  const activeCategory = searchParams?.categorie;
  const query = searchParams?.q?.trim().toLowerCase() ?? "";
  const activePrice = searchParams?.prix;
  const tri = searchParams?.tri ?? "recommandes";

  let filtered = products;

  if (activeCategory) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.materials.toLowerCase().includes(query) ||
        p.origin.toLowerCase().includes(query),
    );
  }
  if (activePrice) {
    const range = PRICE_RANGES.find((r) => r.id === activePrice);
    if (range) filtered = filtered.filter((p) => range.test(p.price));
  }

  const sorted = [...filtered].sort((a, b) => {
    if (tri === "prix-asc") return a.price - b.price;
    if (tri === "prix-desc") return b.price - a.price;
    if (tri === "nouveautes")
      return a.badge === "Nouveau" ? -1 : b.badge === "Nouveau" ? 1 : 0;
    if (tri === "populaire") return b.rating - a.rating;
    return 0;
  });

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      categorie: activeCategory,
      q: searchParams?.q,
      prix: activePrice,
      tri: searchParams?.tri,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `/boutique?${qs}` : "/boutique";
  };

  const filtersContent = (
    <>
      <div>
        <p className="eyebrow mb-4">Catégories</p>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={buildHref({ categorie: undefined })}
              className="link-underline"
              style={{
                color: !activeCategory ? "var(--teal-deep)" : "var(--ink)",
                fontWeight: !activeCategory ? 600 : 400,
              }}
            >
              Tout voir ({products.length})
            </a>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <a
                href={buildHref({
                  categorie: activeCategory === c.slug ? undefined : c.slug,
                })}
                className="link-underline"
                style={{
                  color:
                    activeCategory === c.slug
                      ? "var(--teal-deep)"
                      : "var(--ink)",
                  fontWeight: activeCategory === c.slug ? 600 : 400,
                }}
              >
                {c.name} ({c.count})
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="divider-stitch" />

      <div>
        <p className="eyebrow mb-4">Prix</p>
        <div className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
          {PRICE_RANGES.map((r) => (
            <a
              key={r.id}
              href={buildHref({
                prix: activePrice === r.id ? undefined : r.id,
              })}
              className="flex items-center gap-2"
              style={{
                color:
                  activePrice === r.id ? "var(--teal-deep)" : "var(--ink-soft)",
                fontWeight: activePrice === r.id ? 600 : 400,
              }}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full border"
                style={{
                  borderColor:
                    activePrice === r.id ? "var(--teal)" : "var(--line)",
                  background:
                    activePrice === r.id ? "var(--teal)" : "transparent",
                }}
              />
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10 lg:py-14">
      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
        Accueil / Boutique
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">Toute la boutique</h1>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          {sorted.length} pièce{sorted.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* --------------------------------------------------------- RECHERCHE */}
      <form method="get" className="relative mt-8 max-w-md">
        {activeCategory && (
          <input type="hidden" name="categorie" value={activeCategory} />
        )}
        {activePrice && <input type="hidden" name="prix" value={activePrice} />}
        {searchParams?.tri && (
          <input type="hidden" name="tri" value={searchParams.tri} />
        )}
        <RiSearchLine
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--ink-soft)" }}
        />
        <input
          type="search"
          name="q"
          defaultValue={searchParams?.q ?? ""}
          placeholder="Rechercher un panier, un plaid, un bol…"
          className="field-input h-12 rounded-full pl-11"
        />
      </form>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        {/* ---------------------------------------------------------- FILTRES (desktop) */}
        <aside className="hidden space-y-8 lg:block">{filtersContent}</aside>

        {/* -------------------------------------------------------------- GRID */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <MobileFilters resultCount={sorted.length}>
              {filtersContent}
            </MobileFilters>

            <div
              className="ml-auto flex items-center gap-2 text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Trier par
              <Suspense
                fallback={
                  <div
                    className="h-10 w-36 rounded-full border"
                    style={{ borderColor: "var(--line)" }}
                  />
                }
              >
                <SortSelect />
              </Suspense>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="card-hairline flex flex-col items-center gap-2 p-12 text-center">
              <p className="font-display text-xl">Aucun résultat</p>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Essayez un autre mot-clé ou réinitialisez les filtres.
              </p>
              <a
                href="/boutique"
                className="link-underline mt-2 text-sm font-medium"
                style={{ color: "var(--teal-deep)" }}
              >
                Réinitialiser
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {sorted.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
