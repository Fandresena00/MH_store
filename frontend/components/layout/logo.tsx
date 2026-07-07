import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { width: 40, height: 40, className: "h-8 w-auto" },
  md: { width: 56, height: 56, className: "h-11 w-auto" },
  lg: { width: 84, height: 84, className: "h-16 w-auto" },
} as const;

export function Logo({
  className,
  size = "md",
  priority = true,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
}) {
  const s = SIZES[size];
  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="M&H Store — Accueil">
      <Image
        src="/logo.png"
        alt="M&H Store — Live your dream"
        width={s.width}
        height={s.height}
        priority={priority}
        className={cn(s.className, "shrink-0 object-contain")}
      />
    </Link>
  );
}
