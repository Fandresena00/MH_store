import { ProductCard } from "@/components/product/product-card";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { getProduct, getProducts } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [{ url: product.images[0] }] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const products = await getProducts();
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <ProductDetailClient product={product} />
      {related.length > 0 && (
        <section className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
            <h2 className="mb-8 font-display text-2xl">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
