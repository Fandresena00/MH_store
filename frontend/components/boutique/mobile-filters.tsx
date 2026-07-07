"use client";

import { useState } from "react";
import { RiFilter3Line } from "@remixicon/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function MobileFilters({ children, resultCount }: { children: React.ReactNode; resultCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium lg:hidden"
        style={{ borderColor: "var(--line)" }}
      >
        <RiFilter3Line size={14} /> Filtres
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filtrer les produits</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 overflow-y-auto px-5 pb-6">{children}</div>
        <button
          onClick={() => setOpen(false)}
          className="btn-primary mx-5 mb-5 py-3 text-sm font-semibold"
        >
          Voir {resultCount} résultat(s)
        </button>
      </SheetContent>
    </Sheet>
  );
}
