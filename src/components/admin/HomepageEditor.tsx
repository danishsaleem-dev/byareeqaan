"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Check, FolderOpen, Plus, X } from "lucide-react";
import { Card, Field, Fieldset, Input, Textarea, Button, Toggle } from "./ui";
import { Uploader } from "./Uploader";
import { MediaPicker } from "./MediaPicker";
import { saveHomepageSectionAction } from "@/app/admin/actions";
import type { HomepageConfig, MediaFile } from "@/lib/types";

function PickerButton({
  multiple = true,
  onSelect,
}: {
  multiple?: boolean;
  onSelect: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  function handleSelect(files: MediaFile[]) {
    onSelect(files.filter((f) => f.type === "image").map((f) => f.url));
    setOpen(false);
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-plum hover:bg-black/[0.03]"
      >
        <FolderOpen size={13} /> Choose from library
      </button>
      {open && (
        <MediaPicker
          accept="image"
          multiple={multiple}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </>
  );
}

export function HomepageEditor({ initial }: { initial: HomepageConfig }) {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Homepage editor</h1>
        <p className="mt-1 text-sm text-muted">
          Each section saves on its own.
        </p>
      </header>

      <Section<"announcement"> title="Announcement bar" section="announcement" initial={initial.announcement}>
        {(value, set) => (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-plum">Show announcement bar</span>
              <Toggle checked={value.enabled} onChange={(v) => set({ ...value, enabled: v })} />
            </div>
            <Field label="Text">
              <Input value={value.text} onChange={(e) => set({ ...value, text: e.target.value })} />
            </Field>
          </>
        )}
      </Section>

      <Section<"hero"> title="Hero section" section="hero" initial={initial.hero}>
        {(value, set) => (
          <>
            <Fieldset label="Slideshow images">
              <div className="space-y-2">
                {value.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {value.images.map((url) => (
                      <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-black/[0.06]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => set({ ...value, images: value.images.filter((u) => u !== url) })}
                          className="absolute right-1 top-1 rounded bg-white/90 p-0.5 text-red-600 opacity-100 shadow sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Uploader
                    onUploaded={(files) => set({ ...value, images: [...value.images, ...files.filter((f) => f.type === "image").map((f) => f.url)] })}
                    accept="image/*"
                    compact
                    label="Upload images"
                  />
                  <PickerButton
                    multiple
                    onSelect={(urls) => set({ ...value, images: [...value.images, ...urls] })}
                  />
                </div>
              </div>
            </Fieldset>
            <Field label="Headline"><Input value={value.headline} onChange={(e) => set({ ...value, headline: e.target.value })} /></Field>
            <Field label="Subheadline"><Input value={value.subheadline} onChange={(e) => set({ ...value, subheadline: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={value.tagline} onChange={(e) => set({ ...value, tagline: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CTA button text"><Input value={value.ctaText} onChange={(e) => set({ ...value, ctaText: e.target.value })} /></Field>
              <Field label="CTA link"><Input value={value.ctaLink} onChange={(e) => set({ ...value, ctaLink: e.target.value })} /></Field>
            </div>
          </>
        )}
      </Section>

      <Section<"features"> title="Features strip" section="features" initial={initial.features}>
        {(value, set) => (
          <div className="space-y-3">
            {value.items.map((item, i) => (
              <div key={i} className="flex items-end gap-2">
                <Field label="Label" className="w-40">
                  <Input value={item.label} onChange={(e) => set({ items: value.items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} placeholder="Shipping" />
                </Field>
                <Field label="Text" className="flex-1">
                  <Input value={item.text} onChange={(e) => set({ items: value.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} placeholder="All over Pakistan" />
                </Field>
                <button onClick={() => set({ items: value.items.filter((_, j) => j !== i) })} className="mb-1 rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <X size={16} />
                </button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => set({ items: [...value.items, { label: "", text: "" }] })} className="px-3 py-1.5 text-xs">
              <Plus size={14} /> Add item
            </Button>
          </div>
        )}
      </Section>

      <Section<"story"> title="Brand story" section="story" initial={initial.story}>
        {(value, set) => (
          <>
            <Fieldset label="Image">
              <div className="space-y-2">
                {value.image && (
                  <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-xl border border-black/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value.image} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => set({ ...value, image: "" })} className="absolute right-2 top-2 rounded bg-white/90 p-1 text-red-600 shadow">
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Uploader onUploaded={(f) => f[0] && set({ ...value, image: f[0].url })} accept="image/*" multiple={false} compact label="Upload image" />
                  <PickerButton multiple={false} onSelect={(urls) => urls[0] && set({ ...value, image: urls[0] })} />
                </div>
              </div>
            </Fieldset>
            <Field label="Title"><Input value={value.title} onChange={(e) => set({ ...value, title: e.target.value })} /></Field>
            <Field label="Content"><Textarea value={value.content} onChange={(e) => set({ ...value, content: e.target.value })} rows={4} /></Field>
          </>
        )}
      </Section>

      <Section<"contact"> title="Contact section" section="contact" initial={initial.contact}>
        {(value, set) => (
          <>
            <Field label="Title"><Input value={value.title} onChange={(e) => set({ ...value, title: e.target.value })} /></Field>
            <Field label="Message"><Textarea value={value.message} onChange={(e) => set({ ...value, message: e.target.value })} rows={3} /></Field>
          </>
        )}
      </Section>
    </div>
  );
}

function Section<K extends keyof HomepageConfig>({
  title,
  section,
  initial,
  children,
}: {
  title: string;
  section: K;
  initial: HomepageConfig[K];
  children: (value: HomepageConfig[K], set: (v: HomepageConfig[K]) => void) => ReactNode;
}) {
  const [value, setValue] = useState<HomepageConfig[K]>(initial);
  const [saving, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    start(async () => {
      await saveHomepageSectionAction(section, value);
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
