import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };

export default function CheckoutPage() {
  return <CheckoutClient />;
}
