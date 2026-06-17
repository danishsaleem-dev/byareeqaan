"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadFileDirect } from "@/lib/upload-client";
import type { MediaFile } from "@/lib/types";

export function Uploader({
  onUploaded,
  accept = "image/*",
  multiple = true,
  label = "Drop files here or click to upload",
  className,
  compact = false,
}: {
  onUploaded: (files: MediaFile[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handle(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => f.size > 0);
    if (files.length === 0) return;

    setError(null);
    setBusy(true);
    setProgress({ done: 0, total: files.length });

    const uploaded: MediaFile[] = [];
    const failed: string[] = [];
    // Upload sequentially so a huge batch doesn't open dozens of connections.
    for (let i = 0; i < files.length; i++) {
      try {
        uploaded.push(await uploadFileDirect(files[i]));
      } catch (e) {
        failed.push(`${files[i].name}: ${(e as Error).message}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }

    if (uploaded.length) onUploaded(uploaded);
    if (failed.length) setError(failed.join(" · "));
    setBusy(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors disabled:cursor-not-allowed",
          compact ? "px-3 py-4" : "px-4 py-8",
          drag
            ? "border-violet bg-violet/5"
            : "border-black/15 bg-black/[0.02] hover:border-violet/50 hover:bg-violet/[0.03]",
        )}
      >
        {busy ? (
          <Loader2 size={compact ? 18 : 24} className="animate-spin text-violet-deep" />
        ) : (
          <UploadCloud size={compact ? 18 : 24} className="text-violet-deep" />
        )}
        <span className={clsx("font-medium text-plum", compact ? "text-xs" : "text-sm")}>
          {busy
            ? progress
              ? `Uploading ${progress.done}/${progress.total}…`
              : "Uploading…"
            : label}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => handle(e.target.files)}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
