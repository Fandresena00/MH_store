import type { Metadata } from "next";
import { CartClient } from "./cart-client";

export const metadata: Metadata = { title: "Votre panier", robots: { index: false } };

export default function CartPage() {
  return <CartClient />;
}
