import { OrdersTable } from "@/components/suivi-commande/orders-table";
import { getOrder } from "@/lib/api";
import { RiSearchLine } from "@remixicon/react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez l'état de vos commandes M&H Store en temps réel.",
};

export default async function OrderTrackingPage({
  searchParams,
}: {
  searchParams: { commande?: string; q?: string };
}) {
  const reference = searchParams?.commande ?? searchParams?.q;
  const list = reference
    ? await getOrder(reference)
        .then((response) => [response.data])
        .catch(() => [])
    : [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
      <h1 className="font-display text-4xl">Suivre mes commandes</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
        Cliquez sur une commande pour en voir le détail complet.
      </p>

      <form method="get" className="relative mt-6 max-w-sm">
        <RiSearchLine
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--ink-soft)" }}
        />
        <input
          type="search"
          name="q"
          defaultValue={searchParams?.q ?? ""}
          placeholder="Rechercher un numéro de commande…"
          className="field-input h-11 rounded-full pl-11"
        />
      </form>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl">
          {list.length} commande{list.length > 1 ? "s" : ""}
        </h2>
        {list.length === 0 ? (
          <div
            className="card-hairline p-10 text-center text-sm"
            style={{ color: "var(--ink-soft)" }}
          >
            Aucune commande ne correspond à cette recherche.
          </div>
        ) : (
          <Suspense
            fallback={
              <div
                className="card-hairline p-10 text-center text-sm"
                style={{ color: "var(--ink-soft)" }}
              >
                Chargement…
              </div>
            }
          >
            <OrdersTable
              orders={list}
              initialOrderId={searchParams?.commande}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
