"use client";

import { Logo } from "@/components/layout/logo";
import { ProductMedia } from "@/components/product/product-media";
import { checkout } from "@/lib/api";
import { paymentMethods, type PaymentMethodId } from "@/lib/data";
import { formatAr } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { RiBankCardLine, RiLockLine, RiSmartphoneLine } from "@remixicon/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

export function CheckoutClient() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const [payment, setPayment] = useState<PaymentMethodId>("mvola");
  const [error, setError] = useState("");
  const shipping = subtotal >= 150000 || subtotal === 0 ? 0 : 8000;
  const total = subtotal + shipping;
  const selected = paymentMethods.find((m) => m.id === payment)!;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await checkout({
        lines: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        paymentMethod: {
          mvola: "MVOLA",
          orange: "ORANGE_MONEY",
          airtel: "ARTEL_MONEY",
          visa: "BRED",
        }[payment],
        shippingAddress: form.get("address"),
        shippingCity: form.get("city"),
        clientName: form.get("clientName"),
        email: form.get("email"),
        phone: form.get("phone"),
      });
      window.location.href = result.paymentLink;
    } catch {
      setError("La commande n'a pas pu être créée. Vérifiez vos informations.");
    }
  }

  return (
    <div className="mx-auto max-w-300 px-5 py-8 lg:px-10">
      <div className="mb-10 flex items-center justify-between">
        <Logo size="sm" />
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--ink-soft)" }}
        >
          <RiLockLine size={13} /> Paiement sécurisé
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
        {/* --------------------------------------------------------------- FORM */}
        <form className="space-y-10" onSubmit={handleSubmit}>
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                1
              </span>
              <h2 className="font-display text-xl">Contact</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="clientName"
                placeholder="Nom complet"
                className="field-input sm:col-span-2"
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                className="field-input"
                required
              />
              <input
                name="phone"
                placeholder="Téléphone"
                className="field-input"
                required
              />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                2
              </span>
              <h2 className="font-display text-xl">Adresse de livraison</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="address"
                placeholder="Adresse"
                className="field-input sm:col-span-2"
                required
              />
              <input
                name="city"
                placeholder="Ville"
                className="field-input"
                required
              />
              <input
                name="postalCode"
                placeholder="Quartier / code postal"
                className="field-input"
              />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                3
              </span>
              <h2 className="font-display text-xl">Paiement</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className="flex flex-col items-center gap-2 rounded-lg border py-5 text-xs font-medium transition-colors sm:text-sm"
                  style={{
                    borderColor:
                      payment === m.id ? "var(--teal)" : "var(--line)",
                    background:
                      payment === m.id ? "var(--sand)" : "transparent",
                  }}
                >
                  {m.type === "mobile" ? (
                    <RiSmartphoneLine
                      size={20}
                      style={{ color: "var(--teal)" }}
                    />
                  ) : (
                    <RiBankCardLine
                      size={20}
                      style={{ color: "var(--teal)" }}
                    />
                  )}
                  {m.label}
                </button>
              ))}
            </div>

            {selected.type === "mobile" ? (
              <>
                <input
                  placeholder="Numéro de téléphone mobile money"
                  className="field-input mt-3"
                />
                <p
                  className="mt-2 text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Vous recevrez une demande de confirmation directement sur
                  votre téléphone.
                </p>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  placeholder="Numéro de carte"
                  inputMode="numeric"
                  className="field-input sm:col-span-2"
                />
                <input
                  placeholder="Nom sur la carte"
                  className="field-input sm:col-span-2"
                />
                <input placeholder="MM / AA" className="field-input" />
                <input
                  placeholder="CVC"
                  inputMode="numeric"
                  className="field-input"
                />
              </div>
            )}
          </section>

          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={!lines.length || lines.some((line) => !line.product.id)}
            className="btn-coral w-full py-4 text-sm font-semibold disabled:opacity-50"
          >
            Payer {formatAr(total)}
          </button>
        </form>

        {/* ------------------------------------------------------------- SUMMARY */}
        <aside
          className="h-fit rounded-xl border p-6"
          style={{
            borderColor: "var(--line)",
            background: "var(--paper-raised)",
          }}
        >
          <h2 className="font-display text-lg">Résumé de commande</h2>
          <div className="mt-5 space-y-4">
            {lines.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Votre panier est vide.{" "}
                <Link href="/boutique" className="link-underline">
                  Retour à la boutique
                </Link>
              </p>
            ) : (
              lines.map((l) => (
                <div key={l.product.slug} className="flex items-center gap-3">
                  <ProductMedia
                    src={l.product.images[0]}
                    alt={l.product.name}
                    className="h-14 w-14 shrink-0 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{l.product.name}</p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      Qté {l.quantity}
                    </p>
                  </div>
                  <span className="text-sm">
                    {formatAr(l.product.price * l.quantity)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="divider-stitch my-5" />
          <div className="space-y-2 text-sm">
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
        </aside>
      </div>
    </div>
  );
}
