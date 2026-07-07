"use client";

import type { Product } from "@/lib/data";
import { formatAr } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import {
  RiAddLine,
  RiArrowGoBackLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiSubtractLine,
  RiTruckLine,
} from "@remixicon/react";
import { useState } from "react";
import { ProductMedia } from "./product-media";

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const add = useCartStore((s) => s.add);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10 lg:py-14">
      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
        Accueil / Boutique / {product.category} /{" "}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* --------------------------------------------------------------- GALERIE */}
        <div>
          <ProductMedia
            src={product.images[activeImage]}
            alt={product.name}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-square rounded-xl"
          />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className="aspect-square overflow-hidden rounded-lg transition-all"
                style={{
                  outline:
                    i === activeImage
                      ? `2px solid var(--teal)`
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
                aria-label={`Voir la photo ${i + 1}`}
              >
                <ProductMedia
                  src={img}
                  alt={`${product.name} — vue ${i + 1}`}
                  className="h-full w-full"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- INFOS */}
        <div>
          {product.badge && (
            <span
              className="eyebrow rounded-full px-2.5 py-1"
              style={{ background: "var(--sand)" }}
            >
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl">
              {formatAr(product.price)}
            </span>
            {product.compareAt && (
              <span
                className="text-base line-through"
                style={{ color: "var(--ink-soft)" }}
              >
                {formatAr(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--success)" }}>
            {product.stock > 0
              ? `En stock — ${product.stock} disponibles`
              : "Rupture de stock"}
          </p>

          <p
            className="mt-6 text-sm leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            {product.description}
          </p>

          <div className="divider-stitch my-6" />

          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex items-center rounded-full border"
              style={{ borderColor: "var(--line)" }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Diminuer la quantité"
              >
                <RiSubtractLine size={16} />
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Augmenter la quantité"
              >
                <RiAddLine size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, quantity);
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 1800);
              }}
              disabled={product.stock === 0}
              className="btn-coral flex-1 px-8 py-3.5 text-sm font-semibold"
            >
              {justAdded ? (
                <span className="flex items-center gap-2">
                  <RiCheckLine size={16} /> Ajouté au panier
                </span>
              ) : (
                `Ajouter au panier — ${formatAr(product.price * quantity)}`
              )}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: RiTruckLine, text: "Expédié sous 48h" },
              { icon: RiShieldCheckLine, text: "Paiement sécurisé" },
              { icon: RiArrowGoBackLine, text: "Retour sous 14 jours" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs"
                style={{ color: "var(--ink-soft)" }}
              >
                <Icon size={16} style={{ color: "var(--teal)" }} />
                {text}
              </div>
            ))}
          </div>

          <div
            className="mt-10 border-t py-6 text-sm leading-relaxed"
            style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
          >
            <ul className="space-y-2">
              <li>
                <strong style={{ color: "var(--ink)" }}>Matières :</strong>{" "}
                {product.materials}
              </li>
              <li>
                <strong style={{ color: "var(--ink)" }}>Origine :</strong>{" "}
                {product.origin}
              </li>
              <li>
                <strong style={{ color: "var(--ink)" }}>Entretien :</strong>{" "}
                nettoyer avec un chiffon sec, éviter l&apos;humidité prolongée.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
