"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { Profile } from "@/lib/types";
import { saveProfileAction } from "@/app/(site)/account/actions";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveProfileAction({ fullName, phone });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(res.error ?? "Could not save");
      }
    });
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-5 rounded-2xl border border-plum/10 bg-white p-6">
      <Field label="Full name">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Areeqa Khan"
          className={inputCls}
        />
      </Field>

      <Field label="Phone">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="03xx xxxxxxx"
          inputMode="tel"
          className={inputCls}
        />
      </Field>

      <Field label="Email">
        <input value={profile.email} disabled className={`${inputCls} cursor-not-allowed bg-cream/50 text-muted`} />
        <p className="mt-1.5 text-xs text-muted">
          Your sign-in email can&apos;t be changed here.
        </p>
      </Field>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-violet-deep px-7 py-3 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet disabled:opacity-60"
      >
        {pending ? "Saving…" : saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-violet focus:ring-2 focus:ring-violet/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-plum">{label}</span>
      {children}
    </label>
  );
}
