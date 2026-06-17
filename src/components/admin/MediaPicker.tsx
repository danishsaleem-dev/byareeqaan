"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { clsx } from "clsx";
import { Search, X, Check, Trash2, FileVideo, Loader2, ImageIcon } from "lucide-react";
import { Input, Button } from "./ui";
import { Uploader } from "./Uploader";
import { listMediaAction, deleteMediaAction } from "@/app/admin/actions";
import type { MediaFile } from "@/lib/types";

type Accept = "image" | "video" | "all";
type Tab = "library" | "upload";

export function MediaPicker({
  accept = "all",
  multiple = true,
  onSelect,
  onClose,
}: {
  accept?: Accept;
  multiple?: boolean;
  onSelect: (files: MediaFile[]) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await listMediaAction();
        if (alive) setFiles(list);
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const acceptUpload =
    accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter(
      (f) =>
        (accept === "all" || f.type === accept) &&
        (!q || f.filename.toLowerCase().includes(q)),
    );
  }, [files, accept, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  function onUploaded(uploaded: MediaFile[]) {
    setFiles((prev) => [...uploaded, ...prev]);
    setSelected((prev) => {
      const next = multiple ? new Set(prev) : new Set<string>();
      uploaded.forEach((f) => next.add(f.id));
      return next;
    });
    setTab("library");
  }

  function remove(file: MediaFile) {
    if (!confirm(`Delete "${file.filename}" from the library? This cannot be undone.`))
      return;
    start(async () => {
      await deleteMediaAction(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    });
  }

  function confirmSelection() {
    const picked = files.filter((f) => selected.has(f.id));
    if (picked.length) onSelect(picked);
    onClose();
  }

  const title =
    accept === "image"
      ? "Select images"
      : accept === "video"
        ? "Select videos"
        : "Select media";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-black/[0.04] hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* tabs */}
        <div className="flex gap-1 border-b border-black/[0.06] px-5 pt-3">
          {(["library", "upload"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "rounded-t-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "border-b-2 border-violet-deep text-violet-deep"
                  : "text-muted hover:text-ink",
              )}
            >
              {t === "library" ? "Library" : "Upload new"}
            </button>
          ))}
          {tab === "library" && (
            <div className="relative ml-auto mb-2 w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-9 pl-8 text-sm"
              />
            </div>
          )}
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {tab === "upload" ? (
            <Uploader
              onUploaded={onUploaded}
              accept={acceptUpload}
              label="Drop files here or click to upload"
            />
          ) : loading ? (
            <div className="flex h-48 items-center justify-center text-muted">
              <Loader2 className="animate-spin" />
            </div>
          ) : shown.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-sm text-muted">
              <ImageIcon size={28} className="opacity-40" />
              {files.length === 0
                ? "Your library is empty. Upload something to get started."
                : "No matching files."}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {shown.map((f) => {
                const isSel = selected.has(f.id);
                return (
                  <div
                    key={f.id}
                    className={clsx(
                      "group relative aspect-square overflow-hidden rounded-xl border bg-black/[0.03] transition-all",
                      isSel
                        ? "border-violet ring-2 ring-violet/30"
                        : "border-black/[0.06] hover:border-violet/40",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(f.id)}
                      className="block h-full w-full"
                      title={f.filename}
                    >
                      <Preview file={f} />
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-left text-[10px] text-white">
                        {f.filename}
                      </span>
                    </button>

                    {/* selection check */}
                    <span
                      className={clsx(
                        "pointer-events-none absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                        isSel
                          ? "border-violet-deep bg-violet-deep text-white"
                          : "border-white/80 bg-black/20",
                      )}
                    >
                      {isSel && <Check size={12} />}
                    </span>

                    {/* delete */}
                    <button
                      type="button"
                      onClick={() => remove(f)}
                      disabled={pending}
                      title="Delete from library"
                      className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-red-600 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-black/[0.015] px-5 py-3">
          <span className="text-sm text-muted">
            {selected.size > 0
              ? `${selected.size} selected`
              : "Nothing selected"}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={confirmSelection} disabled={selected.size === 0}>
              Add {selected.size > 0 ? selected.size : ""}{" "}
              {selected.size === 1 ? "item" : "items"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ file }: { file: MediaFile }) {
  if (file.type === "video") {
    return (
      <span className="flex h-full w-full items-center justify-center text-violet-deep">
        <FileVideo size={26} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={file.url} alt={file.filename} className="h-full w-full object-cover" />;
}
