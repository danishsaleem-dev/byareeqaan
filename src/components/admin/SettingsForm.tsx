"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Card, Field, Input, Textarea, Button } from "./ui";
import { Uploader } from "./Uploader";
import { saveSiteGroupAction } from "@/app/admin/actions";
import type { SiteConfig } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteConfig }) {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Site settings</h1>
        <p className="mt-1 text-sm text-muted">Each group saves on its own.</p>
      </header>

      <Group<"brand"> title="Brand" group="brand" initial={initial.brand}>
        {(value, set) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site name"><Input value={value.siteName} onChange={(e) => set({ ...value, siteName: e.target.value })} /></Field>
              <Field label="Tagline"><Input value={value.tagline} onChange={(e) => set({ ...value, tagline: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImagePick label="Logo" url={value.logoUrl} onChange={(u) => set({ ...value, logoUrl: u })} />
              <ImagePick label="Favicon" url={value.faviconUrl} onChange={(u) => set({ ...value, faviconUrl: u })} />
            </div>
          </>
        )}
      </Group>

      <Group<"socials"> title="Social media" group="socials" initial={initial.socials}>
        {(value, set) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram"><Input value={value.instagram} onChange={(e) => set({ ...value, instagram: e.target.value })} placeholder="@byareeqaan" /></Field>
            <Field label="TikTok"><Input value={value.tiktok} onChange={(e) => set({ ...value, tiktok: e.target.value })} placeholder="@by_areeqan" /></Field>
            <Field label="Facebook"><Input value={value.facebook} onChange={(e) => set({ ...value, facebook: e.target.value })} placeholder="ByAreeqan" /></Field>
            <Field label="WhatsApp number" hint="digits only, intl format"><Input value={value.whatsapp} onChange={(e) => set({ ...value, whatsapp: e.target.value })} placeholder="923364246604" /></Field>
          </div>
        )}
      </Group>

      <Group<"contact"> title="Contact info" group="contact" initial={initial.contact}>
        {(value, set) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><Input type="email" value={value.email} onChange={(e) => set({ ...value, email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={value.phone} onChange={(e) => set({ ...value, phone: e.target.value })} /></Field>
          </div>
        )}
      </Group>

      <Group<"policies"> title="Policies" group="policies" initial={initial.policies}>
        {(value, set) => (
          <>
            <Field label="Shipping policy"><Textarea value={value.shipping} onChange={(e) => set({ ...value, shipping: e.target.value })} rows={4} /></Field>
            <Field label="Return policy"><Textarea value={value.returns} onChange={(e) => set({ ...value, returns: e.target.value })} rows={4} /></Field>
          </>
        )}
      </Group>
    </div>
  );
}

function ImagePick({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (url: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {url && (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-16 w-auto rounded-lg border border-black/[0.06] bg-white object-contain p-1" />
            <button onClick={() => onChange("")} className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-red-600 shadow">
              <X size={14} />
            </button>
          </div>
        )}
        <Uploader onUploaded={(f) => f[0] && onChange(f[0].url)} accept="image/*" multiple={false} compact label="Upload" />
      </div>
    </Field>
  );
}

function Group<K extends keyof SiteConfig>({
  title,
  group,
  initial,
  children,
}: {
  title: string;
  group: K;
  initial: SiteConfig[K];
  children: (value: SiteConfig[K], set: (v: SiteConfig[K]) => void) => ReactNode;
}) {
  const [value, setValue] = useState<SiteConfig[K]>(initial);
  const [saving, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    start(async () => {
      await saveSiteGroupAction(group, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <Button onClick={save} disabled={saving} className="px-4 py-2 text-sm">
          {saved ? <><Check size={15} /> Saved</> : saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="space-y-4">{children(value, setValue)}</div>
    </Card>
  );
}
