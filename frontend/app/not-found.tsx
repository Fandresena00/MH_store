import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
      <p className="font-display text-7xl" style={{ color: "var(--coral)" }}>404</p>
      <h1 className="mt-4 font-display text-2xl">Cette page s'est égarée en chemin</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
        Peut-être qu'elle est partie tisser un panier à Ambalavao.
      </p>
      <Link href="/" className="btn-primary mt-8 px-8 py-3.5 text-sm font-semibold">
        Retour à l'accueil
      </Link>
    </div>
  );
}
