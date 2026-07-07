import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductMedia({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("group/media relative overflow-hidden bg-sand", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      {/* Léger voile de marque pour unifier des photos aux tonalités variées */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.06]"
        style={{ background: "var(--teal-deep)" }}
      />
    </div>
  );
}
