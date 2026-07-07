"use client";

import { useState } from "react";
import { RiQuestionLine, RiMailLine, RiChat3Line, RiAddLine, RiSubtractLine } from "@remixicon/react";

const FAQS = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "Les commandes sont expédiées sous 48h depuis Antananarivo. Comptez 2 à 4 jours pour les grandes villes et 5 à 8 jours pour les zones plus reculées.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Oui, vous disposez de 14 jours après réception pour retourner un article non utilisé, dans son emballage d'origine.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "MVola, Orange Money, Airtel Money, ainsi que les cartes bancaires Visa et Mastercard.",
  },
  {
    q: "Comment sont fabriqués vos produits ?",
    a: "Chaque pièce est fabriquée à la main par l'un de nos neuf ateliers partenaires à travers Madagascar, selon des techniques traditionnelles.",
  },
];

export function SupportClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-10 lg:py-14">
      <div className="text-center">
        <p className="eyebrow">Support client</p>
        <h1 className="mt-2 font-display text-4xl">Comment pouvons-nous vous aider ?</h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: RiQuestionLine, title: "Centre d'aide", desc: "Réponses aux questions fréquentes" },
          { icon: RiChat3Line, title: "Chat en direct", desc: "Lun-Ven, 8h-18h" },
          { icon: RiMailLine, title: "Par email", desc: "hello@mhstore.mg" },
        ].map((c) => (
          <div key={c.title} className="card-hairline flex flex-col items-center p-6 text-center">
            <c.icon size={22} style={{ color: "var(--teal)" }} />
            <p className="mt-3 font-display text-base">{c.title}</p>
            <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-6 font-display text-2xl">Questions fréquentes</h2>
        <div style={{ borderColor: "var(--line)" }}>
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b py-5" style={{ borderColor: "var(--line)" }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-display text-lg">{f.q}</span>
                {openIndex === i ? <RiSubtractLine size={18} /> : <RiAddLine size={18} />}
              </button>
              {openIndex === i && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-xl border p-6 sm:p-10" style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}>
        <h2 className="font-display text-2xl">Nous contacter</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
          Une question sur une commande ou un produit ? Écrivez-nous.
        </p>
        <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input placeholder="Nom" className="field-input" />
          <input placeholder="Email" type="email" className="field-input" />
          <textarea placeholder="Votre message" rows={4} className="field-input h-28 py-3 sm:col-span-2" />
          <button type="submit" className="btn-primary px-6 py-3 text-sm font-semibold sm:col-span-2 sm:w-fit">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
}
