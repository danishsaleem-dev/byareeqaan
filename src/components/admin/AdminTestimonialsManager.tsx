"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import { Card, Field, Fieldset, Input, Textarea, Button, Toggle } from "./ui";
import { Uploader } from "./Uploader";
import { MediaPicker } from "./MediaPicker";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/app/admin/actions";
import type { Testimonial, SourceType, MediaType, TestimonialInput } from "@/lib/testimonials";
import type { MediaFile } from "@/lib/types";

const SOURCE_LABELS: Record<SourceType, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  video: "Video",
  text: "Text quote",
};

const SOURCE_COLORS: Record<SourceType, string> = {
  whatsapp: "bg-emerald-100 text-emerald-700",
  instagram: "bg-pink-100 text-pink-700",
  video: "bg-violet/10 text-violet-deep",
  text: "bg-cream text-plum",
};

const empty: TestimonialInput = {
  authorName: "",
  authorHandle: "",
  content: "",
  mediaUrl: "",
  mediaType: "image",
  sourceType: "whatsapp",
  active: true,
  sortOrder: 0,
};

function TestimonialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<TestimonialInput> & { id?: string };
  onSave: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<TestimonialInput & { id?: string }>({ ...empty, ...initial });
  const [saving, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const needsMedia = form.sourceType === "whatsapp" || form.sourceType === "instagram" || form.sourceType === "video";
  const mediaAccept: "image" | "video" | "all" =
    form.sourceType === "video" ? "video" : form.sourceType === "whatsapp" || form.sourceType === "instagram" ? "image" : "all";

  function save() {
    if (!form.authorName.trim()) { setError("Author name is required."); return; }
    setError(null);
    start(async () => {
      const res = await saveTestimonialAction(form);
      if (res.ok) onSave();
      else setError(res.error ?? "Failed to save.");
    });
  }

  function handleMediaPick(files: MediaFile[]) {
    const f = files[0];
    if (!f) return;
    setForm((p) => ({ ...p, mediaUrl: f.url, mediaType: f.type as MediaType }));
    setPickerOpen(false);
  }

  return (
    <Card className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Source type">
          <select
            value={form.sourceType}
            onChange={(e) => setForm((p) => ({ ...p, sourceType: e.target.value as SourceType }))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-violet"
          >
            {(Object.keys(SOURCE_LABELS) as SourceType[]).map((s) => (
              <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort order" hint="lower = first">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer name">
          <Input
            value={form.authorName}
            onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
            placeholder="Fatima A."
          />
        </Field>
        <Field label="Handle / location" hint="optional">
          <Input
            value={form.authorHandle}
            onChange={(e) => setForm((p) => ({ ...p, authorHandle: e.target.value }))}
            placeholder="@fatima · Lahore"
          />
        </Field>
      </div>

      <Field label="Quote / caption" hint="optional for screenshot-only reviews">
        <Textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          rows={3}
          placeholder="Their exact words or a short caption…"
        />
      </Field>

      {needsMedia && (
        <Fieldset label={form.sourceType === "video" ? "Video" : "Screenshot"} hint="upload or pick from library">
          {form.mediaUrl && (
            <div className="relative mb-2 inline-block">
              {form.mediaType === "video" ? (
                <video src={form.mediaUrl} className="h-28 w-auto rounded-xl border object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.mediaUrl} alt="" className="h-28 w-auto rounded-xl border object-cover" />
              )}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mediaUrl: "" }))}
                className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-red-600 shadow"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Uploader
              accept={mediaAccept === "video" ? "video/*" : "image/*"}
              multiple={false}
              compact
              label="Upload"
              onUploaded={(files) => {
                const f = files[0];
                if (f) setForm((p) => ({ ...p, mediaUrl: f.url, mediaType: f.type as MediaType }));
              }}
            />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-plum hover:bg-black/[0.03]"
            >
              From library
            </button>
          </div>
        </Fieldset>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-plum">
          Show on site
          <Toggle checked={form.active} onChange={(v) => setForm((p) => ({ ...p, active: v }))} />
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} className="px-4 py-2 text-sm">
              Cancel
            </Button>
          )}
          <Button onClick={save} disabled={saving} className="px-4 py-2 text-sm">
            {saving ? "Saving…" : <><Check size={14} /> Save</>}
          </Button>
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

      {pickerOpen && (
        <MediaPicker
          accept={mediaAccept}
          multiple={false}
          onClose={() => setPickerOpen(false)}
          onSelect={handleMediaPick}
        />
      )}
    </Card>
  );
}

export function AdminTestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [, start] = useTransition();

  function reload() {
    window.location.reload();
  }

  function handleToggle(id: string, active: boolean) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, active } : t)));
    start(() => toggleTestimonialActiveAction(id, active));
  }

  function handleDelete(t: Testimonial) {
    if (!confirm(`Delete review by ${t.authorName}?`)) return;
    setItems((prev) => prev.filter((x) => x.id !== t.id));
    start(() => deleteTestimonialAction(t.id));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Reviews</h1>
          <p className="mt-1 text-sm text-muted">
            Manage testimonials shown on the website.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 px-4 py-2.5 text-sm">
          <Plus size={15} /> Add review
        </Button>
      </header>

      {showForm && (
        <TestimonialForm
          initial={empty}
          onSave={() => { setShowForm(false); reload(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {items.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-plum/20 p-10 text-center">
          <p className="text-sm text-muted">No reviews yet. Add one above.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((t) =>
          editing === t.id ? (
            <TestimonialForm
              key={t.id}
              initial={t}
              onSave={() => { setEditing(null); reload(); }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div
              key={t.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-plum/10 bg-white p-4 sm:flex-nowrap"
            >
              {t.mediaUrl && (
                t.mediaType === "video" ? (
                  <video src={t.mediaUrl} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.mediaUrl} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                )
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${SOURCE_COLORS[t.sourceType]}`}>
                    {SOURCE_LABELS[t.sourceType]}
                  </span>
                  <span className="font-semibold text-ink">{t.authorName}</span>
                  {t.authorHandle && <span className="text-xs text-muted">{t.authorHandle}</span>}
                </div>
                {t.content && (
                  <p className="text-sm text-plum/80 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleToggle(t.id, !t.active)}
                  title={t.active ? "Hide" : "Show"}
                  className={`rounded-lg p-1.5 transition-colors ${t.active ? "text-emerald-600 hover:bg-emerald-50" : "text-black/30 hover:bg-black/[0.04]"}`}
                >
                  {t.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => setEditing(t.id)}
                  className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-black/[0.04] hover:text-ink"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
