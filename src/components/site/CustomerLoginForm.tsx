"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

export function CustomerLoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setStatus("sending");
    setError(null);

    const supabase = createSupabaseBrowser();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      next,
    )}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo, shouldCreateUser: true },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="rounded-3xl border border-plum/10 bg-cream/40 p-8 text-center"
      >
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-deep/10 text-violet-deep">
          <CheckCircle2 size={26} />
        </span>
        <h2 className="font-display text-2xl font-medium text-ink">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a sign-in link to <strong className="text-plum">{email}</strong>.
          Tap it on this device and you&apos;ll be signed straight in.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-violet-deep transition-colors hover:text-violet"
        >
          Use a different email
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-plum">
          Email address
        </label>
        <div className="relative">
          <Mail
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-full border border-plum/15 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-violet focus:ring-2 focus:ring-violet/15"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease }}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-deep px-8 py-3.5 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet disabled:opacity-60"
      >
        {status === "sending" ? (
          "Sending link…"
        ) : (
          <>
            Email me a sign-in link <ArrowRight size={16} />
          </>
        )}
      </motion.button>

      <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted">
        <Sparkles size={13} className="text-gold" />
        No password needed — we&apos;ll email you a secure link.
      </p>
    </form>
  );
}
