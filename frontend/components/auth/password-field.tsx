"use client";

import { useId, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";

export function PasswordField({ label = "Mot de passe", placeholder = "••••••••" }: { label?: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="field-input pr-11"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center"
          style={{ color: "var(--ink-soft)" }}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {visible ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
        </button>
      </div>
    </div>
  );
}
