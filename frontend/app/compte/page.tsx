import type { Metadata } from "next";
import { AccountClient } from "./account-client";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

export default function AccountPage() {
  return <AccountClient />;
}
