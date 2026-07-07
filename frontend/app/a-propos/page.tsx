import type { Metadata } from "next";
import { RiLeafLine, RiHandCoinLine, RiCommunityLine, RiRecycleLine } from "@remixicon/react";
import { ProductMedia } from "@/components/product/product-media";
import { heroImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire de M&H Store, ses valeurs et les neuf ateliers partenaires à travers Madagascar.",
};

const VALUES = [
  { icon: RiHandCoinLine, title: "Rémunération juste", desc: "Nous fixons les prix d'achat avec chaque atelier avant la production, pas après." },
  { icon: RiLeafLine, title: "Matières responsables", desc: "Raphia, coton, bois issus de filières locales et de replantation certifiée." },
  { icon: RiCommunityLine, title: "Neuf ateliers partenaires", desc: "Une relation directe et durable, sans intermédiaire ni sous-traitance en cascade." },
  { icon: RiRecycleLine, title: "Peu, mais bien", desc: "Des collections restreintes plutôt qu'un renouvellement permanent." },
];

const TEAM = [
  { name: "Mialy Rakoto", role: "Fondatrice & direction artistique" },
  { name: "Hery Andriamahefa", role: "Relations ateliers" },
  { name: "Fara Ratsimba", role: "Opérations & logistique" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--sand)" }}>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <p className="eyebrow">Notre histoire</p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Née d'un carnet de voyage, devenue une maison.
            </h1>
            <p className="mt-6 text-[1.05rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              M&H Store est partie d'un constat simple : l'artisanat malgache est d'une richesse rare, mais
              trop souvent invisible en dehors de ses régions d'origine. Depuis 2023, nous parcourons les
              hauts plateaux et les ateliers du pays pour sélectionner des pièces qui méritent d'être vues,
              racontées et portées ailleurs.
            </p>
          </div>
          <ProductMedia src={heroImages.about} alt="Atelier artisanal malgache" className="aspect-[4/5] rounded-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-10 lg:py-20">
        <p className="eyebrow text-center">Nos valeurs</p>
        <h2 className="mt-2 text-center font-display text-3xl">Ce qui guide chaque choix</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--sand)", color: "var(--teal)" }}>
                <v.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--teal-deep)", color: "var(--paper)" }}>
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center lg:px-10">
          <p className="eyebrow" style={{ color: "var(--coral)" }}>Notre équipe</p>
          <h2 className="mt-2 font-display text-3xl">Trois personnes, neuf ateliers, un même fil</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name}>
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-2xl text-white"
                  style={{ background: "linear-gradient(135deg, var(--coral), var(--teal))" }}
                >
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="mt-4 font-display text-lg">{m.name}</p>
                <p className="text-sm opacity-75">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-16 text-center lg:py-20">
        <h2 className="font-display text-3xl">Live your dream</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Notre signature n'est pas un simple slogan : c'est l'idée que le foyer que l'on construit devrait
          ressembler à ce que l'on est. Nous espérons que chaque pièce M&H Store y contribue, un objet à la fois.
        </p>
      </section>
    </div>
  );
}
