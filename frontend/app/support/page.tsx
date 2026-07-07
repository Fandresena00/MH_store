import type { Metadata } from "next";
import { SupportClient } from "./support-client";

export const metadata: Metadata = {
  title: "Support client",
  description: "FAQ, livraison, retours et contact — toute l'aide M&H Store en un seul endroit.",
};

export default function SupportPage() {
  return <SupportClient />;
}
