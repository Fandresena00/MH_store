"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, formatAr } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import {
  RiArrowRightLine,
  RiLoginBoxLine,
  RiMenuLine,
  RiShoppingBasketLine,
  RiTruckLine,
  RiUser3Line,
  RiUserAddLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const NAV = [
  { label: "Boutique", href: "/boutique" },
  { label: "Journal", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
  { label: "Suivi de commande", href: "/suivi-commande" },
  { label: "Support", href: "/support" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const count = useCartStore((s) => s.count());
  const subtotal = useCartStore((s) => s.subtotal());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("site-header sticky top-0 z-50", scrolled && "is-scrolled")}
    >
      <div className="mx-auto flex h-20 max-w-350 items-center justify-between px-5 lg:px-10">
        <div className="flex items-center gap-10">
          <Logo size="lg" />
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline text-[0.9rem] font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          {/* -------------------------------------------------------- PROFIL */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand sm:flex"
              aria-label="Mon compte"
            >
              <RiUser3Line size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Espace client
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/connexion"
                  className="flex w-full items-center gap-2.5"
                >
                  <RiLoginBoxLine size={16} /> Se connecter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/inscription"
                  className="flex w-full items-center gap-2.5"
                >
                  <RiUserAddLine size={16} /> Créer un compte
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/suivi-commande"
                  className="flex w-full items-center gap-2.5"
                >
                  <RiTruckLine size={16} /> Suivre une commande
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/compte"
                  className="flex w-full items-center gap-2.5"
                >
                  <RiUser3Line size={16} /> Mon compte
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --------------------------------------------------------- PANIER */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand"
              aria-label="Panier"
            >
              <RiShoppingBasketLine size={20} />
              {count > 0 && (
                <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-paper-raised">
                  {count}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Votre panier
              </div>
              <DropdownMenuSeparator />
              {lines.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-ink-soft">
                    Votre panier est vide.
                  </p>
                  <Link
                    href="/boutique"
                    className="btn-primary mt-3 inline-flex px-5 py-2 text-xs font-semibold"
                  >
                    Découvrir la boutique
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-72 space-y-1 overflow-y-auto px-1 py-1">
                    {lines.slice(0, 4).map((l) => (
                      <div
                        key={l.product.slug}
                        className="flex items-center gap-3 rounded-lg px-2 py-2"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={l.product.images[0]}
                            alt={l.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {l.product.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Qté {l.quantity} ·{" "}
                            {formatAr(l.product.price * l.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            remove(l.product.slug);
                          }}
                          className="text-xs text-ink-soft underline-offset-2 hover:underline"
                          aria-label={`Retirer ${l.product.name}`}
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                    {lines.length > 4 && (
                      <p className="px-2 pt-1 text-xs text-ink-soft">
                        + {lines.length - 4} autre(s) article(s)
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold">
                    <span>Sous-total</span>
                    <span>{formatAr(subtotal)}</span>
                  </div>
                  <div className="flex gap-2 p-2 pt-1">
                    <Link
                      href="/panier"
                      className="btn-outline flex-1 justify-center py-2 text-xs font-semibold"
                    >
                      Voir le panier
                    </Link>
                    <Link
                      href="/checkout"
                      className="btn-coral flex-1 justify-center py-2 text-xs font-semibold"
                    >
                      Commander
                    </Link>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --------------------------------------------------------- MOBILE */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <RiMenuLine size={21} />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                <Logo size="md" />
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-1 px-5">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-[0.95rem] font-medium text-ink hover:bg-sand"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="divider-stitch mx-5" />
              <div className="flex flex-col gap-2 p-5">
                <Link
                  href="/connexion"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                  Se connecter <RiArrowRightLine size={15} />
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                  Créer un compte
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
