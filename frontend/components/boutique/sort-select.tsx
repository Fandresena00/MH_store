"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "recommandes", label: "Nos recommandations" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "populaire", label: "Meilleures notes" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("tri") ?? "recommandes";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recommandes") params.delete("tri");
    else params.set("tri", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border bg-transparent px-3 py-2 text-xs outline-none"
      style={{ borderColor: "var(--line)" }}
      aria-label="Trier les produits"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
