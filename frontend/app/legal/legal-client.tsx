"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const SECTIONS = [
  {
    id: "cgv",
    label: "CGV",
    title: "Conditions générales de vente",
    body: [
      "Les présentes conditions régissent les ventes réalisées sur le site M&H Store entre la société M&H Store SARL et tout client. Toute commande implique l'acceptation pleine et entière des présentes conditions.",
      "Les prix sont indiqués en Ariary (Ar), toutes taxes comprises. M&H Store se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
      "Le paiement s'effectue par MVola, Orange Money, Airtel Money ou carte bancaire (Visa, Mastercard) au moment de la commande. La commande n'est confirmée qu'après réception du paiement.",
    ],
  },
  {
    id: "confidentialite",
    label: "Confidentialité",
    title: "Politique de confidentialité",
    body: [
      "M&H Store collecte uniquement les données nécessaires au traitement des commandes : nom, adresse, téléphone et adresse email. Ces données ne sont jamais revendues à des tiers.",
      "Les données sont conservées pendant la durée nécessaire à la gestion de la relation commerciale, puis archivées conformément aux obligations légales.",
      "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à hello@mhstore.mg.",
    ],
  },
  {
    id: "retours",
    label: "Retours",
    title: "Politique de retour",
    body: [
      "Vous disposez de 14 jours à compter de la réception de votre commande pour retourner un article qui ne vous convient pas, à condition qu'il soit non utilisé et dans son emballage d'origine.",
      "Les frais de retour sont à la charge du client, sauf en cas de défaut de fabrication ou d'erreur d'envoi.",
      "Le remboursement est effectué sous 7 jours ouvrés après réception et vérification de l'article retourné, sur le même moyen de paiement utilisé à l'achat (mobile money ou carte bancaire).",
    ],
  },
  {
    id: "livraison",
    label: "Livraison",
    title: "Politique de livraison",
    body: [
      "Les commandes sont expédiées sous 48h depuis notre atelier d'Antananarivo. Les délais de livraison varient entre 2 et 8 jours selon la destination à Madagascar.",
      "La livraison est offerte à partir de 150 000 Ar d'achat. En dessous de ce montant, des frais de 8 000 Ar s'appliquent.",
      "Un numéro de suivi est communiqué par email dès l'expédition de votre commande, consultable à tout moment sur la page Suivi de commande.",
    ],
  },
  {
    id: "paiement",
    label: "Paiement",
    title: "Moyens de paiement acceptés",
    body: [
      "M&H Store accepte le paiement par MVola, Orange Money et Airtel Money, ainsi que par carte bancaire Visa et Mastercard.",
      "Les paiements par carte sont traités via une passerelle sécurisée conforme aux standards PCI-DSS ; M&H Store ne stocke jamais les données de carte bancaire.",
      "En cas d'échec de paiement, la commande reste en attente pendant 24h avant annulation automatique.",
    ],
  },
  {
    id: "mentions",
    label: "Mentions légales",
    title: "Mentions légales",
    body: [
      "M&H Store SARL, société immatriculée à Antananarivo, Madagascar. Siège social : Antananarivo 101.",
      "Directrice de la publication : Mialy Rakoto. Hébergement du site assuré par un prestataire tiers.",
      "Pour toute question relative au site, contactez hello@mhstore.mg.",
    ],
  },
];

export function LegalClient() {
  const searchParams = useSearchParams();
  const initial = SECTIONS.some((s) => s.id === searchParams.get("section")) ? searchParams.get("section")! : "cgv";
  const [active, setActive] = useState(initial);
  const current = SECTIONS.find((s) => s.id === active)!;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 lg:px-10 lg:py-14">
      <p className="eyebrow">Informations légales</p>
      <h1 className="mt-2 font-display text-4xl">Transparence &amp; conformité</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="shrink-0 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors"
              style={{
                background: active === s.id ? "var(--sand)" : "transparent",
                color: active === s.id ? "var(--teal-deep)" : "var(--ink)",
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="max-w-2xl space-y-4">
          <h2 className="font-display text-2xl">{current.title}</h2>
          {current.body.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {p}
            </p>
          ))}
          <p className="pt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
            Document de travail — juillet 2026
          </p>
        </div>
      </div>
    </div>
  );
}
