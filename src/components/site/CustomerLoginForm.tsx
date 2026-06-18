"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

/** Turn Supabase's raw error text into something friendly. */
function friendly(raw?: string): string | null {
  if (!raw) return null;
  if (/expired|invalid/i.test(raw)) {
    return "That link expired or was already used. Pop your email in again and we'll send a fresh one.";
  }
  return raw;
}

export function CustomerLoginForm({
  next,
  initialError,
}: {
  next: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(friendly(initialError));
  const [resent, setResent] = useState(false);

  async function sendLink(value: string) {
    const supabase = createSupabaseBrowser();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      next,
    )}`;
    return supabase.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo, shouldCreateUser: true },
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setStatus("sending");
    setError(null);

    const { error } = await sendLink(value);
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  async function resend() {
    if (!email.trim()) return;
    setResent(false);
    const { error } = await sendLink(email.trim());
    if (!error) {
      setResent(true);
      setTimeout(() => setResent(false), 3000);
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
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Links expire quickly — open it soon. Check spam if it&apos;s not there in
          a minute.
        </p>
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            onClick={resend}
            className="text-sm font-medium text-violet-deep transition-colors hover:text-violet"
          >
            {resent ? "Link sent again ✓" : "Didn't get it? Resend link"}
          </button>
          <button
            onClick={() => {
              setStatus("idle");
              setResent(false);
            }}
            className="text-sm text-muted transition-colors hover:text-plum"
          >
            Use a different email
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
