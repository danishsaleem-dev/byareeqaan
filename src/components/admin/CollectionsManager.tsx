"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { Plus, Pencil, Trash2, X, FolderOpen } from "lucide-react";
import { Card, Field, Input, Textarea, Button } from "./ui";
import { Uploader } from "./Uploader";
import { slugify } from "@/lib/slug";
import {
  saveCollectionAction,
  deleteCollectionAction,
} from "@/app/admin/actions";
import type { Collection } from "@/lib/types";

type Editing =
  | { mode: "new" }
  | { mode: "edit"; collection: Collection }
  | null;

export function CollectionsManager({ initial }: { initial: Collection[] }) {
  const [collections, setCollections] = useState(initial);
  const [editing, setEditing] = useState<Editing>(null);
  const [, start] = useTransition();

  function remove(c: Collection) {
    if (!confirm(`Delete collection "${c.name}"?`)) return;
    setCollections((prev) => prev.filter((x) => x.id !== c.id));
    start(() => deleteCollectionAction(c.id));
  }

  function onSaved(saved: Collection) {
    setCollections((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Collections</h1>
          <p className="mt-1 text-sm text-muted">{collections.length} collections</p>
        </div>
        <Button onClick={() => setEditing({ mode: "new" })}>
          <Plus size={16} /> New collection
        </Button>
      </header>

      {collections.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted">
          No collections yet.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Card key={c.id} className="group overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-violet/5">
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-violet/40">
                    <FolderOpen size={32} />
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditing({ mode: "edit", collection: c })}
                    className="rounded-lg bg-white/90 p-1.5 text-plum shadow hover:text-violet-deep"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="rounded-lg bg-white/90 p-1.5 text-red-600 shadow"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-ink">{c.name}</h3>
                <p className="text-xs text-muted">/{c.slug}</p>
                {c.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{c.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <CollectionModal
          collection={editing.mode === "edit" ? editing.collection : undefined}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function CollectionModal({
  collection,
  onClose,
  onSaved,
}: {
  collection?: Collection;
  onClose: () => void;
  onSaved: (c: Collection) => void;
}) {
  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [imageUrl, setImageUrl] = useState(collection?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  function save() {
    setError(null);
    start(async () => {
      const res = await saveCollectionAction({
        id: collection?.id,
        name,
        slug: slug || slugify(name),
        description,
        imageUrl,
      });
      if (res.ok && res.collection) onSaved(res.collection);
      else setError(res.error ?? "Could not save");
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            {collection ? "Edit collection" : "New collection"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Necklaces" />
          </Field>
          <Field
            label="Slug"
            hint={
              <button onClick={() => setSlug(slugify(name))} className="text-violet-deep hover:underline">
                Generate
              </button>
            }
          >
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
          </Field>
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </Field>
          <Field label="Image">
            <div className="space-y-2">
              {imageUrl && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-black/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1 text-red-600 shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <Uploader
                onUploaded={(files) => files[0] && setImageUrl(files[0].url)}
                accept="image/*"
                multiple={false}
                compact
                label="Upload image"
              />
            </div>
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving || !name.trim()}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
