import Link from "next/link";
import type { Metadata } from "next";
import { RiArrowRightLine } from "@remixicon/react";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordField } from "@/components/auth/password-field";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Espace client"
      title="Bon retour parmi nous"
      subtitle="Connectez-vous pour suivre vos commandes et retrouver vos favoris."
    >
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="field-label">Adresse email</label>
          <input id="email" type="email" placeholder="vous@email.com" className="field-input" autoComplete="email" />
        </div>
        <PasswordField />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2" style={{ color: "var(--ink-soft)" }}>
            <input type="checkbox" className="accent-[var(--teal)]" />
            Se souvenir de moi
          </label>
          <button type="button" className="link-underline font-medium" style={{ color: "var(--teal-deep)" }}>
            Mot de passe oublié ?
          </button>
        </div>
        <button type="submit" className="btn-coral flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold">
          Se connecter <RiArrowRightLine size={16} />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--line)" }} />
        <span className="text-xs" style={{ color: "var(--ink-soft)" }}>ou</span>
        <div className="h-px flex-1" style={{ background: "var(--line)" }} />
      </div>

      <button className="btn-outline flex w-full items-center justify-center gap-2 py-3 text-sm font-medium">
        Continuer avec Google
      </button>

      <p className="mt-8 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="link-underline font-semibold" style={{ color: "var(--teal-deep)" }}>
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
