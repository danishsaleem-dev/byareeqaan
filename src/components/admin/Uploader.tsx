"use client";

import { useRef, useState, useTransition } from "react";
import { clsx } from "clsx";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadMediaAction } from "@/app/admin/actions";
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
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    setError(null);
    start(async () => {
      const res = await uploadMediaAction(fd);
      if (res.ok && res.files) onUploaded(res.files as MediaFile[]);
      else setError(res.error || "Upload failed");
    });
  }

  return (
    <div className={className}>
      <button
        type="button"
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
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
          compact ? "px-3 py-4" : "px-4 py-8",
          drag
            ? "border-violet bg-violet/5"
            : "border-black/15 bg-black/[0.02] hover:border-violet/50 hover:bg-violet/[0.03]",
        )}
      >
        {pending ? (
          <Loader2 size={compact ? 18 : 24} className="animate-spin text-violet-deep" />
        ) : (
          <UploadCloud size={compact ? 18 : 24} className="text-violet-deep" />
        )}
        <span className={clsx("font-medium text-plum", compact ? "text-xs" : "text-sm")}>
          {pending ? "Uploading…" : label}
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
