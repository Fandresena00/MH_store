"use client";

import { ProductMedia } from "@/components/product/product-media";
import { Badge } from "@/components/ui/badge";
import { getAccountOrders, getCurrentUser } from "@/lib/api";
import { orders, products } from "@/lib/data";
import { formatAr, formatDateShort } from "@/lib/utils";
import {
  RiHeartLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiSettings4Line,
  RiShoppingBagLine,
} from "@remixicon/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TABS = [
  { id: "commandes", label: "Mes commandes", icon: RiShoppingBagLine },
  { id: "adresses", label: "Adresses", icon: RiMapPinLine },
  { id: "favoris", label: "Favoris", icon: RiHeartLine },
  { id: "parametres", label: "Paramètres", icon: RiSettings4Line },
] as const;

function statusClassName(status: string) {
  if (status === "Livrée")
    return "border-transparent bg-success/15 text-success";
  if (status === "Annulée") return "border-transparent bg-error/10 text-error";
  if (status === "En transit")
    return "border-transparent bg-teal text-paper-raised";
  return "border-transparent bg-sand text-coral-deep";
}

export function AccountClient() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("commandes");
  const [account, setAccount] = useState<{
    fullName: string;
    email: string;
    createdAt: string;
  } | null>(null);
  const [accountOrders, setAccountOrders] = useState<typeof orders>([]);

  useEffect(() => {
    Promise.all([getCurrentUser(), getAccountOrders()])
      .then(([user, response]) => {
        setAccount(user.data);
        setAccountOrders(response.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-10 lg:py-14">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ background: "var(--teal)" }}
        >
          HR
        </div>
        <div>
          <h1 className="font-display text-2xl">
            Bonjour, {account?.fullName ?? "client"}
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            {account
              ? `Membre depuis ${formatDateShort(account.createdAt)}`
              : "Chargement du compte..."}
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                background: tab === t.id ? "var(--sand)" : "transparent",
                color: tab === t.id ? "var(--teal-deep)" : "var(--ink)",
              }}
            >
              <t.icon size={17} />
              {t.label}
            </button>
          ))}
          <button
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            style={{ color: "var(--error)" }}
          >
            <RiLogoutBoxRLine size={17} /> Déconnexion
          </button>
        </nav>

        <div>
          {tab === "commandes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">
                  Historique de commandes
                </h2>
                <Link
                  href="/suivi-commande"
                  className="link-underline text-sm font-medium"
                  style={{ color: "var(--teal-deep)" }}
                >
                  Suivi détaillé
                </Link>
              </div>
              {accountOrders.map((o) => (
                <div
                  key={o.id}
                  className="card-hairline flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <p className="font-display text-base">{o.id}</p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {formatDateShort(o.date)} · {o.lines.length} article(s)
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusClassName(o.status)}
                  >
                    {o.status}
                  </Badge>
                  <span className="font-display text-base">
                    {formatAr(o.total)}
                  </span>
                  <Link
                    href={`/suivi-commande?commande=${o.id}`}
                    className="link-underline text-sm font-medium"
                  >
                    Détails
                  </Link>
                </div>
              ))}
            </div>
          )}

          {tab === "adresses" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl">Adresses enregistrées</h2>
              <div className="card-hairline max-w-sm p-5">
                <p className="eyebrow mb-2">Domicile</p>
                <p className="text-sm">Hanta Ravalison</p>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Lot II M 12 Bis, Antaninandro
                  <br />
                  Antananarivo 101, Madagascar
                  <br />
                  +261 34 00 000 00
                </p>
                <button className="link-underline mt-3 text-sm font-medium">
                  Modifier
                </button>
              </div>
              <button className="btn-primary px-6 py-3 text-sm font-semibold">
                + Ajouter une adresse
              </button>
            </div>
          )}

          {tab === "favoris" && (
            <div>
              <h2 className="mb-6 font-display text-xl">Mes favoris</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {products.slice(0, 3).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/produit/${p.slug}`}
                    className="card-hairline overflow-hidden"
                  >
                    <ProductMedia
                      src={p.images[0]}
                      alt={p.name}
                      className="aspect-square"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {formatAr(p.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tab === "parametres" && (
            <div className="max-w-md space-y-5">
              <h2 className="font-display text-xl">
                Informations personnelles
              </h2>
              <div>
                <label className="field-label">Nom complet</label>
                <input defaultValue="Hanta Ravalison" className="field-input" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  defaultValue="hanta.r@email.com"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Téléphone</label>
                <input
                  defaultValue="+261 34 00 000 00"
                  className="field-input"
                />
              </div>
              <button className="btn-primary px-6 py-3 text-sm font-semibold">
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
