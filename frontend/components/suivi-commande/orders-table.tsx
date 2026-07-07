"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RiCheckLine, RiTruckLine, RiArrowRightSLine } from "@remixicon/react";
import { products, paymentMethods, type Order } from "@/lib/data";
import { ProductMedia } from "@/components/product/product-media";
import { formatAr, formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function statusClassName(status: string) {
  if (status === "Livrée") return "border-transparent bg-success/15 text-success";
  if (status === "Annulée") return "border-transparent bg-error/10 text-error";
  if (status === "En transit") return "border-transparent bg-teal text-paper-raised";
  return "border-transparent bg-sand text-coral-deep";
}

export function OrdersTable({ orders, initialOrderId }: { orders: Order[]; initialOrderId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(initialOrderId ?? null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  function openOrder(id: string) {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("commande", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closeDialog() {
    setSelectedId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("commande");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commande</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Suivi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow
              key={o.id}
              onClick={() => openOrder(o.id)}
              className={`cursor-pointer ${o.id === selectedId ? "bg-sand/60" : ""}`}
            >
              <TableCell className="font-display text-sm">{o.id}</TableCell>
              <TableCell className="text-sm" style={{ color: "var(--ink-soft)" }}>
                {formatDateShort(o.date)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClassName(o.status)}>
                  {o.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm" style={{ color: "var(--ink-soft)" }}>
                {o.lines.reduce((s, l) => s + l.quantity, 0)} art.
              </TableCell>
              <TableCell className="text-sm font-medium">{formatAr(o.total)}</TableCell>
              <TableCell className="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrder(o.id);
                  }}
                  className="link-underline inline-flex items-center gap-1 text-sm font-medium"
                  style={{ color: "var(--teal-deep)" }}
                >
                  Voir le détail <RiArrowRightSLine size={14} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* --------------------------------------------------------- MODALE DÉTAIL */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <p className="eyebrow">Commande {selected.id}</p>
                <DialogTitle className="font-display text-2xl">
                  {selected.estimatedDelivery
                    ? `Arrivée estimée le ${formatDateShort(selected.estimatedDelivery)}`
                    : `Commande passée le ${formatDateShort(selected.date)}`}
                </DialogTitle>
                <Badge variant="outline" className={`${statusClassName(selected.status)} mt-1 w-fit`}>
                  {selected.status}
                </Badge>
              </DialogHeader>

              <div className="mt-2">
                {selected.timeline.map((s, i) => (
                  <div key={s.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ background: s.done ? "var(--teal)" : "var(--line)" }}
                      >
                        {s.done && <RiCheckLine size={16} />}
                      </div>
                      {i < selected.timeline.length - 1 && (
                        <div className="w-px flex-1" style={{ background: s.done ? "var(--teal)" : "var(--line)", minHeight: "28px" }} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium" style={{ color: s.done ? "var(--ink)" : "var(--ink-soft)" }}>
                        {s.label}
                      </p>
                      {s.date && <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{s.date}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider-stitch my-2" />

              <div className="space-y-3">
                {selected.lines.map((line) => {
                  const product = products.find((p) => p.slug === line.productSlug);
                  if (!product) return null;
                  return (
                    <div key={line.productSlug} className="flex items-center gap-3">
                      <ProductMedia src={product.images[0]} alt={product.name} className="h-14 w-14 rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs" style={{ color: "var(--ink-soft)" }}>Qté {line.quantity}</p>
                      </div>
                      <span className="text-sm">{formatAr(product.price * line.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg p-4 text-xs" style={{ background: "var(--sand)", color: "var(--ink-soft)" }}>
                <span>
                  Paiement :{" "}
                  <strong style={{ color: "var(--ink)" }}>
                    {paymentMethods.find((m) => m.id === selected.paymentMethod)?.label}
                  </strong>
                </span>
                {selected.trackingNumber && (
                  <span className="flex items-center gap-1.5">
                    <RiTruckLine size={14} />
                    <strong style={{ color: "var(--ink)" }}>{selected.trackingNumber}</strong> — {selected.carrier}
                  </span>
                )}
                <span>
                  Total : <strong style={{ color: "var(--ink)" }}>{formatAr(selected.total)}</strong>
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
