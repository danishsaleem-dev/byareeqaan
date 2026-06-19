"use client";

import { useMemo, useState, useTransition } from "react";
import { clsx } from "clsx";
import {
  Search,
  LayoutGrid,
  List,
  Copy,
  ExternalLink,
  Trash2,
  X,
  Check,
  FileVideo,
  Pencil,
  Save,
} from "lucide-react";
import { Uploader } from "./Uploader";
import { Input, Button } from "./ui";
import { deleteMediaAction, updateMediaAction } from "@/app/admin/actions";
import type { MediaFile } from "@/lib/types";

type Filter = "all" | "image" | "video";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function MediaLibrary({ initial }: { initial: MediaFile[] }) {
  const [files, setFiles] = useState(initial);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter(
      (f) =>
        (filter === "all" || f.type === filter) &&
        (!q || f.filename.toLowerCase().includes(q)),
    );
  }, [files, filter, query]);

  function onUploaded(uploaded: MediaFile[]) {
    setFiles((prev) => [...uploaded, ...prev]);
  }

  function remove(file: MediaFile) {
    if (!confirm(`Delete "${file.filename}"? This cannot be undone.`)) return;
    start(async () => {
      await deleteMediaAction(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      if (selected?.id === file.id) setSelected(null);
    });
  }

  function onSaved(updated: MediaFile) {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setSelected(updated);
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Media library
          </h1>
          <p className="mt-1 text-sm text-muted">{files.length} files</p>
        </div>
      </header>

      <Uploader onUploaded={onUploaded} accept="image/*,video/*" />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="pl-9"
          />
        </div>
        <div className="flex rounded-xl border border-black/10 bg-white p-1">
          {(["all", "image", "video"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === f ? "bg-violet-deep text-white" : "text-muted hover:text-ink",
              )}
            >
              {f === "all" ? "All" : `${f}s`}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-black/10 bg-white p-1">
          <button
            onClick={() => setView("grid")}
            className={clsx("rounded-lg p-1.5", view === "grid" ? "bg-violet-deep text-white" : "text-muted")}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={clsx("rounded-lg p-1.5", view === "list" ? "bg-violet-deep text-white" : "text-muted")}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Files + detail */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex-1">
          {shown.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-muted">
              No files found.
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {shown.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className={clsx(
                    "group relative aspect-square overflow-hidden rounded-xl border bg-black/[0.03] transition-all",
                    selected?.id === f.id
                      ? "border-violet ring-2 ring-violet/20"
                      : "border-black/[0.06] hover:border-violet/40",
                  )}
                >
                  <Preview file={f} />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-left text-[11px] text-white">
                    {f.filename}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
              <ul className="divide-y divide-black/[0.06]">
                {shown.map((f) => (
                  <li key={f.id}>
                    <button
                      onClick={() => setSelected(f)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-black/[0.02]"
                    >
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/[0.04]">
                        <Preview file={f} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{f.filename}</span>
                        {f.altText && (
                          <span className="block truncate text-xs text-muted">{f.altText}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-muted">{formatSize(f.size)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Detail sidebar */}
        {selected && (
          <aside className="w-full shrink-0 lg:w-72">
            <DetailPanel
              file={selected}
              copied={copied}
              pending={pending}
              onCopy={() => copy(selected.url)}
              onRemove={() => remove(selected)}
              onClose={() => setSelected(null)}
              onSaved={onSaved}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

// ── Detail panel with inline editing ─────────────────────────────────────────
function DetailPanel({
  file,
  copied,
  pending,
  onCopy,
  onRemove,
  onClose,
  onSaved,
}: {
  file: MediaFile;
  copied: boolean;
  pending: boolean;
  onCopy: () => void;
  onRemove: () => void;
  onClose: () => void;
  onSaved: (f: MediaFile) => void;
}) {
  const [editName, setEditName] = useState(file.filename);
  const [editAlt, setEditAlt] = useState(file.altText);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  // Reset local state when the selected file changes.
  const fileId = file.id;
  useState(() => {
    setEditName(file.filename);
    setEditAlt(file.altText);
    setEditing(false);
  });

  async function save() {
    setSaving(true);
    setSaveErr(null);
    const res = await updateMediaAction(fileId, {
      filename: editName.trim() || file.filename,
      altText: editAlt.trim(),
    });
    setSaving(false);
    if (!res.ok) {
      setSaveErr(res.error ?? "Save failed");
    } else {
      onSaved({ ...file, filename: editName.trim() || file.filename, altText: editAlt.trim() });
      setEditing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-4 lg:sticky lg:top-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">File details</h3>
        <button onClick={onClose} className="text-muted hover:text-ink">
          <X size={16} />
        </button>
      </div>

      {/* Preview */}
      <div className="mb-4 overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.03]">
        <div className="aspect-square">
          <Preview file={file} />
        </div>
      </div>

      {/* Editable fields */}
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              File name
            </label>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-violet transition-colors hover:bg-violet/10"
              >
                <Pencil size={11} /> Edit
              </button>
            )}
          </div>
          {editing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-violet/30 bg-violet/5 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-violet"
            />
          ) : (
            <p className="break-all text-sm text-ink">{file.filename}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
            Alt text
          </label>
          {editing ? (
            <textarea
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              rows={2}
              placeholder="Describe the image for screen readers and SEO"
              className="w-full resize-none rounded-lg border border-violet/30 bg-violet/5 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-violet"
            />
          ) : (
            <p className="text-sm text-ink">
              {file.altText || <span className="text-muted italic">None</span>}
            </p>
          )}
        </div>

        {/* static details */}
        <div className="rounded-xl bg-black/[0.02] px-3 py-2.5 space-y-1.5">
          <Row label="Type" value={file.type === "image" ? "Image" : "Video"} />
          <Row label="Size" value={formatSize(file.size)} />
          <Row
            label="Uploaded"
            value={new Date(file.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </div>

        {saveErr && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{saveErr}</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2">
        {editing ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              disabled={saving}
              onClick={save}
            >
              <Save size={14} /> {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setEditName(file.filename);
                setEditAlt(file.altText);
                setSaveErr(null);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <Button variant="secondary" className="w-full" onClick={onCopy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy URL"}
            </Button>
            <a href={file.url} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="w-full">
                <ExternalLink size={15} /> Open in new tab
              </Button>
            </a>
            <Button
              variant="danger"
              className="w-full"
              disabled={pending}
              onClick={onRemove}
            >
              <Trash2 size={15} /> Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Preview({ file }: { file: MediaFile }) {
  if (file.type === "video") {
    return (
      <div className="flex h-full w-full items-center justify-center text-violet-deep">
        <FileVideo size={28} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={file.url} alt={file.altText || file.filename} className="h-full w-full object-cover" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
