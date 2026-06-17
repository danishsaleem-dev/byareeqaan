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
} from "lucide-react";
import { Uploader } from "./Uploader";
import { Input, Button } from "./ui";
import { deleteMediaAction } from "@/app/admin/actions";
import type { MediaFile } from "@/lib/types";

type Filter = "all" | "image" | "video";

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
                      <span className="min-w-0 flex-1 truncate text-sm text-ink">
                        {f.filename}
                      </span>
                      <span className="text-xs capitalize text-muted">{f.type}</span>
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
            <div className="rounded-2xl border border-black/[0.06] bg-white p-4 lg:sticky lg:top-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">Details</h3>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-ink">
                  <X size={16} />
                </button>
              </div>
              <div className="mb-3 overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.03]">
                <div className="aspect-square">
                  <Preview file={selected} />
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                <Detail label="Filename" value={selected.filename} />
                <Detail label="Type" value={selected.type} />
                <Detail
                  label="Uploaded"
                  value={new Date(selected.createdAt).toLocaleDateString()}
                />
                <Detail
                  label="Size"
                  value={`${(selected.size / 1024).toFixed(0)} KB`}
                />
              </dl>
              <div className="mt-4 space-y-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => copy(selected.url)}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
                <a href={selected.url} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="w-full">
                    <ExternalLink size={15} /> Open in new tab
                  </Button>
                </a>
                <Button
                  variant="danger"
                  className="w-full"
                  disabled={pending}
                  onClick={() => remove(selected)}
                >
                  <Trash2 size={15} /> Delete
                </Button>
              </div>
            </div>
          </aside>
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
  return <img src={file.url} alt={file.filename} className="h-full w-full object-cover" />;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
