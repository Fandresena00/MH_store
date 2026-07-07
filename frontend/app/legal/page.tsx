import type { Metadata } from "next";
import { Suspense } from "react";
import { LegalClient } from "./legal-client";

export const metadata: Metadata = {
  title: "Informations légales",
  description:
    "Conditions générales de vente, confidentialité, retours, livraison et mentions légales M&H Store.",
};

export default function LegalPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1100px] px-5 py-10 lg:px-10 lg:py-14">
          Chargement…
        </div>
      }
    >
      <LegalClient />
    </Suspense>
  );
}
