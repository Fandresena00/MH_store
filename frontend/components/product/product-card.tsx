"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/data";
import { formatAr } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import {
  RiAddLine,
  RiArrowGoBackLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiShoppingBasketLine,
  RiSubtractLine,
  RiTruckLine,
} from "@remixicon/react";
import { useState } from "react";
import { ProductMedia } from "./product-media";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const existingQuantity = useCartStore(
    (s) => s.lines.find((l) => l.product.slug === product.slug)?.quantity ?? 0,
  );
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="group card-hairline relative overflow-hidden text-left"
      >
        <div className="relative aspect-4/5 overflow-hidden">
          <ProductMedia
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {product.badge && (
            <span
              className="absolute left-3 top-3 z-20 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
              style={{
                background:
                  product.badge === "Nouveau"
                    ? "var(--teal)"
                    : product.badge === "Best-seller"
                      ? "var(--coral)"
                      : "var(--ink)",
              }}
            >
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              add(product, 1);
            }}
            className="absolute bottom-3 right-3 z-20 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ background: "var(--paper-raised)", color: "var(--ink)" }}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <RiShoppingBasketLine size={18} />
          </button>
        </div>

        <div className="space-y-1.5 p-4">
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {product.origin}
          </p>
          <h3 className="font-display text-[1.05rem] leading-snug text-ink">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-base">
              {formatAr(product.price)}
            </span>
            {product.compareAt && (
              <span
                className="text-xs line-through"
                style={{ color: "var(--ink-soft)" }}
              >
                {formatAr(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <DialogContent className="max-w-5xl overflow-y-auto p-0 sm:max-w-5xl">
        <div className="grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <ProductMedia
              src={product.images[0]}
              alt={product.name}
              className="aspect-square rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <DialogHeader className="gap-3">
              <p className="eyebrow">{product.category}</p>
              <DialogTitle className="font-display text-2xl">
                {product.name}
              </DialogTitle>
              <DialogDescription
                className="text-sm leading-relaxed"
                style={{ color: "var(--ink-soft)" }}
              >
                {product.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-baseline gap-3">
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

            <p
              className="mt-2 text-sm"
              style={{
                color: product.stock > 0 ? "var(--success)" : "var(--error)",
              }}
            >
              {product.stock > 0
                ? `${product.stock} disponibles`
                : "Rupture de stock"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
              {existingQuantity > 0
                ? `${existingQuantity} déjà dans votre panier`
                : "Pas encore ajouté au panier"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div
                className="flex items-center rounded-full border"
                style={{ borderColor: "var(--line)" }}
              >
                <button
                  type="button"
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
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Augmenter la quantité"
                >
                  <RiAddLine size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="btn-coral flex-1 px-6 py-3 text-sm font-semibold"
              >
                {justAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <RiCheckLine size={16} /> Ajouté au panier
                  </span>
                ) : (
                  `Ajouter au panier — ${formatAr(product.price * quantity)}`
                )}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
