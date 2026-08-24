import {
  RiFacebookCircleLine,
  RiInstagramLine,
  RiPinterestLine,
} from "@remixicon/react";
import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Maison", href: "/boutique?categorie=maison" },
      { label: "Textile", href: "/boutique?categorie=textile" },
      { label: "Accessoires", href: "/boutique?categorie=accessoires" },
      { label: "Toutes les nouveautés", href: "/boutique?tri=nouveautes" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Suivre ma commande", href: "/suivi-commande" },
      { label: "FAQ & Support", href: "/support" },
      { label: "Livraison", href: "/legal?section=livraison" },
      { label: "Retours", href: "/legal?section=retours" },
    ],
  },
  {
    title: "M&H Store",
    links: [
      { label: "Notre histoire", href: "/a-propos" },
      { label: "Journal", href: "/blog" },
      { label: "Mentions légales", href: "/legal?section=mentions" },
      { label: "Confidentialité", href: "/legal?section=confidentialite" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--teal-deep)", color: "var(--paper)" }}>
      <div className="mx-auto max-w-350 px-5 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm opacity-75">
              Objets artisanaux malgaches, choisis pour leur matière et leur
              histoire. Live your dream.
            </p>
            <div className="mt-5 flex gap-3">
              {[RiInstagramLine, RiFacebookCircleLine, RiPinterestLine].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Suivre M&H Store sur les réseaux sociaux"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/50"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow" style={{ color: "var(--coral)" }}>
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="link-underline text-sm opacity-85"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs opacity-70 sm:flex-row">
          <p>© 2026 M&H Store — Antananarivo, Madagascar</p>
          <p>
            Paiement sécurisé · MVola · Orange Money · Airtel Money · Visa /
            Mastercard
          </p>
        </div>
      </div>
    </footer>
  );
}
