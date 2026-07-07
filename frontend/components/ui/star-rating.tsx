import { RiStarFill, RiStarHalfFill, RiStarLine } from "@remixicon/react";

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" style={{ color: "var(--coral)" }} aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <RiStarFill key={i} size={size} />;
        if (i === full && half) return <RiStarHalfFill key={i} size={size} />;
        return <RiStarLine key={i} size={size} className="opacity-40" />;
      })}
    </div>
  );
}
