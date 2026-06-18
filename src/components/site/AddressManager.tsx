"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Plus, Pencil, Trash2, X, MapPin, Star } from "lucide-react";
import type { Address, AddressInput } from "@/lib/types";
import {
  saveAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/(site)/account/actions";

type Editing = { mode: "new" } | { mode: "edit"; address: Address } | null;

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [, start] = useTransition();

  function remove(a: Address) {
    if (!confirm("Delete this address?")) return;
    start(async () => {
      await deleteAddressAction(a.id);
      router.refresh();
    });
  }

  function makeDefault(a: Address) {
    start(async () => {
      await setDefaultAddressAction(a.id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">Addresses</h2>
          <p className="text-sm text-muted">Saved for faster checkout.</p>
        </div>
        <button
          onClick={() => setEditing({ mode: "new" })}
          className="inline-flex items-center gap-2 rounded-full bg-violet-deep px-4 py-2.5 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum/15 bg-cream/30 p-10 text-center">
          <MapPin size={26} className="mx-auto mb-3 text-violet/40" />
          <p className="text-sm text-muted">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={clsx(
                "relative rounded-2xl border bg-white p-5",
                a.isDefault ? "border-violet/40 ring-1 ring-violet/15" : "border-plum/10",
              )}
            >
              {a.isDefault && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-violet-deep/10 px-2.5 py-1 text-[11px] font-medium text-violet-deep">
                  <Star size={11} fill="currentColor" /> Default
                </span>
              )}
              <p className="font-medium text-ink">{a.fullName || "—"}</p>
              <p className="mt-1 text-sm text-muted">{a.phone}</p>
              <p className="mt-2 text-sm text-muted">{a.address}</p>
              <p className="text-sm text-muted">
                {a.city}
                {a.country ? `, ${a.country}` : ""}
              </p>

              <div className="mt-4 flex items-center gap-3 border-t border-plum/10 pt-3 text-sm">
                <button
                  onClick={() => setEditing({ mode: "edit", address: a })}
                  className="inline-flex items-center gap-1.5 text-plum transition-colors hover:text-violet-deep"
                >
                  <Pencil size={14} /> Edit
                </button>
                {!a.isDefault && (
                  <button
                    onClick={() => makeDefault(a)}
                    className="inline-flex items-center gap-1.5 text-plum transition-colors hover:text-violet-deep"
                  >
                    <Star size={14} /> Set default
                  </button>
                )}
                <button
                  onClick={() => remove(a)}
                  className="ml-auto inline-flex items-center gap-1.5 text-muted transition-colors hover:text-rose-600"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <AddressModal
          address={editing.mode === "edit" ? editing.address : undefined}
          hasAddresses={addresses.length > 0}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function AddressModal({
  address,
  hasAddresses,
  onClose,
  onSaved,
}: {
  address?: Address;
  hasAddresses: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(address?.fullName ?? "");
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [addr, setAddr] = useState(address?.address ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [country, setCountry] = useState(address?.country ?? "Pakistan");
  const [isDefault, setIsDefault] = useState(
    address?.isDefault ?? !hasAddresses,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    const input: AddressInput = {
      fullName,
      phone,
      address: addr,
      city,
      country: country || "Pakistan",
      isDefault,
    };
    start(async () => {
      const res = await saveAddressAction(address?.id ?? null, input);
      if (res.ok) onSaved();
      else setError(res.error ?? "Could not save");
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-ivory p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-medium text-ink">
            {address ? "Edit address" : "Add address"}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
          <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" inputMode="tel" />
          <textarea className={`${inputCls} min-h-20 resize-y`} value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Address (house, street, area)" />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            <input className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-sm text-plum">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-violet-deep"
            />
            Set as default address
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-plum/15 px-5 py-2.5 text-sm font-medium text-plum transition-colors hover:border-violet/40"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={pending || !fullName.trim() || !addr.trim()}
            className="rounded-full bg-violet-deep px-6 py-2.5 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save address"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-violet focus:ring-2 focus:ring-violet/15";
