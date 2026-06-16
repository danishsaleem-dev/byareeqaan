import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ba_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SECRET =
  process.env.ADMIN_SESSION_SECRET || "byareeqaan-dev-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function makeToken(): string {
  const payload = `${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

function isValid(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return false;
  }
  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < MAX_AGE * 1000;
}

/** Constant-time-ish password check. */
export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValid(store.get(COOKIE)?.value);
}
