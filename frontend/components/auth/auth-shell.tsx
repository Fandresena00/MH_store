import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";
import { Logo } from "@/components/layout/logo";
import { ProductMedia } from "@/components/product/product-media";
import { heroImages } from "@/lib/data";

export function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-[calc(100vh-80px-36px)] grid-cols-1 lg:grid-cols-2">
      {/* ------------------------------------------------------------- FORMULAIRE */}
      <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="link-underline mb-8 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--ink-soft)" }}>
            <RiArrowLeftLine size={14} /> Retour à la boutique
          </Link>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl">{title}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* -------------------------------------------------------------- VISUEL */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: "var(--teal-deep)" }}>
        <ProductMedia src={heroImages.auth} alt="Artisanat malgache" className="absolute inset-0 h-full w-full opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--teal-deep)] via-transparent to-[var(--teal-deep)]/50" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo size="md" />
          <div>
            <p className="font-display text-3xl leading-snug">
              « Le geste ne s'apprend pas dans un livre, il se transmet à la main. »
            </p>
            <p className="mt-4 text-sm opacity-75">Live your dream — M&H Store</p>
          </div>
        </div>
      </div>
    </div>
  );
}
