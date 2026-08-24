"use client";

import { Badge } from "@/components/ui/badge";
import {
  createAddress,
  deleteAddress,
  getAccount,
  getAccountOrders,
  logout,
  updateAccount,
  updateAddress,
  type Account,
  type AccountAddress,
} from "@/lib/api";
import type { Order } from "@/lib/data";
import { formatAr, formatDateShort } from "@/lib/utils";
import {
  RiHeartLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiSettings4Line,
  RiShoppingBagLine,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = [
  { id: "commandes", label: "Mes commandes", icon: RiShoppingBagLine },
  { id: "adresses", label: "Adresses", icon: RiMapPinLine },
  { id: "favoris", label: "Favoris", icon: RiHeartLine },
  { id: "parametres", label: "Paramètres", icon: RiSettings4Line },
] as const;

function statusClassName(status: string) {
  if (status === "Livrée")
    return "border-transparent bg-success/15 text-success";
  if (status === "Annulée") return "border-transparent bg-error/10 text-error";
  if (status === "En transit")
    return "border-transparent bg-teal text-paper-raised";
  return "border-transparent bg-sand text-coral-deep";
}

export function AccountClient() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("commandes");
  const [account, setAccount] = useState<Account | null>(null);
  const [accountOrders, setAccountOrders] = useState<Order[]>([]);
  const [addressForm, setAddressForm] = useState<Omit<AccountAddress, "id">>({
    label: "",
    fullName: "",
    line1: "",
    city: "",
    phone: "",
  });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    Promise.all([getAccount(), getAccountOrders()])
      .then(([user, response]) => {
        setAccount(user);
        setAccountOrders(response.data);
      })
      .catch(() => undefined);
  }, []);

  async function savePersonalInformation(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const updated = await updateAccount({
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        phone: String(form.get("phone")),
      });
      setAccount(updated);
      setFeedback("Informations enregistrées.");
    } catch {
      setFeedback("Impossible d’enregistrer les informations.");
    }
  }

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const saved = editingAddressId
        ? await updateAddress(editingAddressId, addressForm)
        : await createAddress(addressForm);
      setAccount((current) =>
        current
          ? {
              ...current,
              addresses: editingAddressId
                ? current.addresses.map((address) =>
                    address.id === saved.id ? saved : address,
                  )
                : [...current.addresses, saved],
            }
          : current,
      );
      setEditingAddressId(null);
      setAddressForm({
        label: "",
        fullName: "",
        line1: "",
        city: "",
        phone: "",
      });
      setFeedback("Adresse enregistrée.");
    } catch {
      setFeedback("Impossible d’enregistrer cette adresse.");
    }
  }

  async function removeAddress(id: number) {
    try {
      await deleteAddress(id);
      setAccount((current) =>
        current
          ? {
              ...current,
              addresses: current.addresses.filter(
                (address) => address.id !== id,
              ),
            }
          : current,
      );
      setFeedback("Adresse supprimée.");
    } catch {
      setFeedback("Impossible de supprimer cette adresse.");
    }
  }

  function startAddressEdit(address: AccountAddress) {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      line1: address.line1,
      city: address.city,
      phone: address.phone,
    });
    setFeedback("");
  }

  return (
    <div className="mx-auto max-w-300 px-5 py-10 lg:px-10 lg:py-14">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ background: "var(--teal)" }}
        >
          HR
        </div>
        <div>
          <h1 className="font-display text-2xl">
            Bonjour, {account?.fullName ?? "client"}
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            {account
              ? `Membre depuis ${formatDateShort(account.createdAt)}`
              : "Chargement du compte..."}
          </p>
        </div>
      </div>
      {feedback && (
        <p className="mt-4 text-sm" style={{ color: "var(--teal-deep)" }}>
          {feedback}
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                background: tab === t.id ? "var(--sand)" : "transparent",
                color: tab === t.id ? "var(--teal-deep)" : "var(--ink)",
              }}
            >
              <t.icon size={17} />
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/connexion");
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            style={{ color: "var(--error)" }}
          >
            <RiLogoutBoxRLine size={17} /> Déconnexion
          </button>
        </nav>

        <div>
          {tab === "commandes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">
                  Historique de commandes
                </h2>
                <Link
                  href="/suivi-commande"
                  className="link-underline text-sm font-medium"
                  style={{ color: "var(--teal-deep)" }}
                >
                  Suivi détaillé
                </Link>
              </div>
              {accountOrders.map((o) => (
                <div
                  key={o.id}
                  className="card-hairline flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <p className="font-display text-base">{o.id}</p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {formatDateShort(o.date)} · {o.lines.length} article(s)
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusClassName(o.status)}
                  >
                    {o.status}
                  </Badge>
                  <span className="font-display text-base">
                    {formatAr(o.total)}
                  </span>
                  <Link
                    href={`/suivi-commande?commande=${o.id}`}
                    className="link-underline text-sm font-medium"
                  >
                    Détails
                  </Link>
                </div>
              ))}
            </div>
          )}

          {tab === "adresses" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl">Adresses enregistrées</h2>
              {account?.addresses.map((address) => (
                <div key={address.id} className="card-hairline max-w-sm p-5">
                  <p className="eyebrow mb-2">{address.label}</p>
                  <p className="text-sm">{address.fullName}</p>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    {address.line1}
                    <br />
                    {address.city}
                    <br />
                    {address.phone}
                  </p>
                  <div className="mt-3 flex gap-4 text-sm font-medium">
                    <button
                      type="button"
                      className="link-underline"
                      onClick={() => startAddressEdit(address)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="link-underline text-error"
                      onClick={() => removeAddress(address.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
              <form onSubmit={saveAddress} className="max-w-md space-y-3">
                <h3 className="font-display text-lg">
                  {editingAddressId
                    ? "Modifier l’adresse"
                    : "Ajouter une adresse"}
                </h3>
                {(["label", "fullName", "line1", "city", "phone"] as const).map(
                  (field) => (
                    <input
                      key={field}
                      required
                      name={field}
                      value={addressForm[field]}
                      onChange={(event) =>
                        setAddressForm({
                          ...addressForm,
                          [field]: event.target.value,
                        })
                      }
                      className="field-input"
                      placeholder={
                        {
                          label: "Libellé",
                          fullName: "Nom complet",
                          line1: "Adresse",
                          city: "Ville",
                          phone: "Téléphone",
                        }[field]
                      }
                    />
                  ),
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn-primary px-6 py-3 text-sm font-semibold"
                  >
                    Enregistrer
                  </button>
                  {editingAddressId && (
                    <button
                      type="button"
                      className="btn-outline px-6 py-3 text-sm"
                      onClick={() => {
                        setEditingAddressId(null);
                        setAddressForm({
                          label: "",
                          fullName: "",
                          line1: "",
                          city: "",
                          phone: "",
                        });
                      }}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {tab === "favoris" && (
            <div>
              <h2 className="mb-6 font-display text-xl">Mes favoris</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Aucun favori enregistré.
                </p>
              </div>
            </div>
          )}

          {tab === "parametres" && (
            <form
              className="max-w-md space-y-5"
              onSubmit={savePersonalInformation}
            >
              <h2 className="font-display text-xl">
                Informations personnelles
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Prénom</label>
                  <input
                    name="firstName"
                    defaultValue={account?.firstName ?? ""}
                    className="field-input"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Nom</label>
                  <input
                    name="lastName"
                    defaultValue={account?.lastName ?? ""}
                    className="field-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  value={account?.email ?? ""}
                  className="field-input"
                  readOnly
                />
              </div>
              <div>
                <label className="field-label">Téléphone</label>
                <input
                  name="phone"
                  defaultValue={account?.phone ?? ""}
                  className="field-input"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-6 py-3 text-sm font-semibold"
              >
                Enregistrer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
