import { Suspense } from "react";
import { VerificationEmailClient } from "./verification-email-client";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerificationEmailClient />
    </Suspense>
  );
}
