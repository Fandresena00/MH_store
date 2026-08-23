"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordField } from "@/components/auth/password-field";
import { ApiError, register } from "@/lib/api";
import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await register({
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      router.push(
        `/verification-email?email=${encodeURIComponent(result.email)}`,
      );
    } catch (cause) {
      setError(
        cause instanceof ApiError && cause.status === 409
          ? "Un compte existe déjà avec cette adresse email."
          : cause instanceof ApiError
            ? cause.message
            : "Impossible de créer le compte. Vérifiez les informations.",
      );
    }
  }
  return (
    <AuthShell
      eyebrow="Nouveau chez M&H Store"
      title="Créer votre compte"
      subtitle="Suivez vos commandes, sauvegardez vos favoris et accédez aux ventes en avant-première."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstname" className="field-label">
              Prénom
            </label>
            <input
              id="firstname"
              name="firstName"
              placeholder="Hanta"
              className="field-input"
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label htmlFor="lastname" className="field-label">
              Nom
            </label>
            <input
              id="lastname"
              name="lastName"
              placeholder="Ravalison"
              className="field-input"
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="vous@email.com"
            className="field-input"
            autoComplete="email"
            required
          />
        </div>
        <PasswordField name="password" placeholder="8 caractères minimum" />
        {error && <p className="text-sm text-error">{error}</p>}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          En créant un compte, vous acceptez nos{" "}
          <Link href="/legal" className="link-underline">
            conditions générales de vente
          </Link>{" "}
          et notre{" "}
          <Link
            href="/legal?section=confidentialite"
            className="link-underline"
          >
            politique de confidentialité
          </Link>
          .
        </p>
        <button
          type="submit"
          className="btn-coral flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold"
        >
          Créer mon compte <RiArrowRightLine size={16} />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--line)" }} />
        <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
          ou
        </span>
        <div className="h-px flex-1" style={{ background: "var(--line)" }} />
      </div>

      <button className="btn-outline flex w-full items-center justify-center gap-2 py-3 text-sm font-medium">
        Continuer avec Google
      </button>

      <p
        className="mt-8 text-center text-sm"
        style={{ color: "var(--ink-soft)" }}
      >
        Déjà client ?{" "}
        <Link
          href="/connexion"
          className="link-underline font-semibold"
          style={{ color: "var(--teal-deep)" }}
        >
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
