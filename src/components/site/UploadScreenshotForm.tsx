"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  createScreenshotUploadAction,
  getScreenshotUrlAction,
  addOrderScreenshotAction,
} from "@/app/(site)/checkout/actions";

export function UploadScreenshotForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setStatus("uploading");
    setError(null);
    try {
      const { path, token } = await createScreenshotUploadAction(file.name);
      const sb = createSupabaseBrowser();
      const { error: upErr } = await sb.storage
        .from("media")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (upErr) throw upErr;
      const url = await getScreenshotUrlAction(path);
      await addOrderScreenshotAction(orderId, url);
      setStatus("done");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        <CheckCircle2 size={16} />
        Screenshot received — we&apos;ll review your payment shortly.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {preview && status === "uploading" && (
        <div className="flex items-center gap-3 text-sm text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="h-12 w-12 rounded-lg object-cover" />
          Uploading…
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}

      <button
        onClick={() => fileRef.current?.click()}
        disabled={status === "uploading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-violet/25 bg-violet/5 py-4 text-sm font-medium text-violet-deep transition-colors hover:border-violet/50 disabled:opacity-60"
      >
        <Upload size={16} />
        {status === "uploading" ? "Uploading…" : "Upload payment screenshot"}
      </button>
    </div>
  );
}
