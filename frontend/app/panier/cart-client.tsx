"use client";

import { ProductMedia } from "@/components/product/product-media";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/data";
import { formatAr } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import {
  RiAddLine,
  RiArrowRightLine,
  RiCloseLine,
  RiShoppingBasket2Line,
  RiSubtractLine,
} from "@remixicon/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartClient() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const add = useCartStore((s) => s.add);
  const subtotal = useCartStore((s) => s.subtotal());
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const shipping = subtotal >= 150000 || subtotal === 0 ? 0 : 8000;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
        <RiShoppingBasket2Line size={40} style={{ color: "var(--teal)" }} />
        <h1 className="mt-6 font-display text-3xl">Votre panier est vide</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
          Découvrez nos pièces artisanales et laissez-vous inspirer.
        </p>
        <Link
          href="/boutique"
          className="btn-primary mt-8 px-8 py-3.5 text-sm font-semibold"
        >
          Explorer la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-10 lg:py-14">
      <h1 className="font-display text-4xl">Votre panier</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        {lines.reduce((s, l) => s + l.quantity, 0)} article(s)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y" style={{ borderColor: "var(--line)" }}>
          {lines.map((line) => (
            <div
              key={line.product.slug}
              className="flex gap-4 border-b py-6"
              style={{ borderColor: "var(--line)" }}
            >
              <Link href={`/produit/${line.product.slug}`} className="shrink-0">
                <ProductMedia
                  src={line.product.images[0]}
                  alt={line.product.name}
                  className="h-28 w-28 rounded-lg"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/produit/${line.product.slug}`}
                      className="link-underline font-display text-lg"
                    >
                      {line.product.name}
                    </Link>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {line.product.origin}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(line.product.slug)}
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--error)]"
                    aria-label={`Retirer ${line.product.name} du panier`}
                  >
                    <RiCloseLine size={18} />
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div
                    className="flex items-center rounded-full border"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <button
                      onClick={() =>
                        setQuantity(line.product.slug, line.quantity - 1)
                      }
                      className="flex h-9 w-9 items-center justify-center"
                      aria-label="Diminuer la quantité"
                    >
                      <RiSubtractLine size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(line.product.slug, line.quantity + 1)
                      }
                      className="flex h-9 w-9 items-center justify-center"
                      aria-label="Augmenter la quantité"
                    >
                      <RiAddLine size={14} />
                    </button>
                  </div>
                  <span className="font-display text-base">
                    {formatAr(line.product.price * line.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <p className="eyebrow mb-4">Souvent ajoutés ensemble</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {products
                .filter((p) => !lines.some((l) => l.product.slug === p.slug))
                .slice(0, 3)
                .map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => add(p, 1)}
                    className="card-hairline flex w-44 shrink-0 flex-col items-start p-3 text-left"
                  >
                    <ProductMedia
                      src={p.images[0]}
                      alt={p.name}
                      className="aspect-square w-full rounded-lg"
                    />
                    <p className="mt-2 line-clamp-1 text-xs font-medium">
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {formatAr(p.price)}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------- RÉCAP */}
        <aside
          className="h-fit rounded-xl border p-6"
          style={{
            borderColor: "var(--line)",
            background: "var(--paper-raised)",
          }}
        >
          <h2 className="font-display text-xl">Récapitulatif</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div
              className="flex justify-between"
              style={{ color: "var(--ink-soft)" }}
            >
              <span>Sous-total</span>
              <span>{formatAr(subtotal)}</span>
            </div>
            <div
              className="flex justify-between"
              style={{ color: "var(--ink-soft)" }}
            >
              <span>Livraison</span>
              <span>{shipping === 0 ? "Offerte" : formatAr(shipping)}</span>
            </div>
          </div>
          <div className="divider-stitch my-4" />
          <div className="flex justify-between font-display text-lg">
            <span>Total</span>
            <span>{formatAr(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-coral mt-6 flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold"
          >
            Passer commande <RiArrowRightLine size={16} />
          </Link>
          <p
            className="mt-4 text-center text-xs"
            style={{ color: "var(--ink-soft)" }}
          >
            Livraison offerte dès 150 000 Ar d'achat
          </p>
        </aside>
      </div>
    </div>
  );
}
