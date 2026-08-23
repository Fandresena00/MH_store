"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { ApiError, verifyEmail } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerificationEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [message, setMessage] = useState("Vérification en cours...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Ouvrez le lien reçu par email pour vérifier votre adresse.");
      return;
    }

    verifyEmail(token)
      .then((response) => {
        setMessage(response.message);
        setVerified(true);
      })
      .catch((cause) => {
        setMessage(
          cause instanceof ApiError
            ? cause.message
            : "La vérification est temporairement indisponible.",
        );
      });
  }, [token]);

  return (
    <AuthShell
      eyebrow="Vérification email"
      title={verified ? "Adresse vérifiée" : "Vérifiez votre adresse email"}
      subtitle={
        email
          ? `Un lien de vérification a été envoyé à ${email}.`
          : "Utilisez le lien reçu dans votre boîte mail."
      }
    >
      <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
        {message}
      </p>
      {verified && (
        <Link
          href="/connexion"
          className="btn-coral mt-8 flex w-full justify-center py-3.5 text-sm font-semibold"
        >
          Se connecter
        </Link>
      )}
    </AuthShell>
  );
}
