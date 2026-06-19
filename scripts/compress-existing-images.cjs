/**
 * One-time script: compress every existing image in the Supabase media library.
 *
 * - Downloads each image from its public URL
 * - Resizes to max 1600px longest-edge and re-encodes as WebP (quality 82)
 * - Overwrites the same Storage path in-place (URL stays identical)
 * - Updates the `size` column in the `media` table
 * - Skips GIF, SVG, video, and already-tiny files (<50 KB — nothing to gain)
 * - Skips files that don't compress (result ≥ original size)
 *
 * Run:  node scripts/compress-existing-images.cjs
 *
 * Safe to re-run: it re-checks each image every time and skips ones that
 * are already small (after the first pass most will fall below the skip floor).
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ── Load env vars from .env.local ────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(".env.local not found");
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

// ── Lazy-require sharp (it's in devDependencies via Next.js image optimisation) ─
let sharp;
try {
  sharp = require("sharp");
} catch {
  throw new Error("sharp is not installed. Run: npm install sharp");
}

const { createClient } = require("@supabase/supabase-js");
const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MEDIA_BUCKET = "media";
const MAX_DIM = 1600;
const QUALITY = 82;
const SKIP_BYTES = 50 * 1024; // files under 50 KB — negligible gain

const SKIP_MIME = ["image/gif", "image/svg+xml", "image/webp"];
const SKIP_EXT = [".gif", ".svg"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "" }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function shouldSkipByUrl(url) {
  try {
    const { pathname } = new URL(url);
    const ext = path.extname(pathname).toLowerCase();
    return SKIP_EXT.includes(ext);
  } catch {
    return false;
  }
}

async function compressBuffer(buf, contentType) {
  if (SKIP_MIME.some((m) => contentType.includes(m))) return null;
  if (buf.length < SKIP_BYTES) return null;

  try {
    const result = await sharp(buf)
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    if (result.length >= buf.length) return null; // already optimal
    return result;
  } catch (err) {
    return null; // corrupt / unsupported — leave original alone
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Fetching media library…");

  const { data: rows, error } = await sb
    .from("media")
    .select("id, filename, url, path, type, size")
    .eq("type", "image")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`DB fetch failed: ${error.message}`);
  console.log(`Found ${rows.length} image records.\n`);

  let skipped = 0;
  let compressed = 0;
  let failed = 0;
  let savedBytes = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const prefix = `[${i + 1}/${rows.length}] ${row.filename}`;

    if (shouldSkipByUrl(row.url)) {
      console.log(`${prefix} — skip (GIF/SVG)`);
      skipped++;
      continue;
    }

    let downloadResult;
    try {
      downloadResult = await fetchBuffer(row.url);
    } catch (err) {
      console.log(`${prefix} — download failed: ${err.message}`);
      failed++;
      continue;
    }

    const { buffer: original, contentType } = downloadResult;

    const webpBuf = await compressBuffer(original, contentType);
    if (!webpBuf) {
      console.log(`${prefix} — skip (already optimal or too small, ${(original.length / 1024).toFixed(0)} KB)`);
      skipped++;
      continue;
    }

    // Re-upload to same storage path, overwrite
    const { error: upErr } = await sb.storage
      .from(MEDIA_BUCKET)
      .upload(row.path, webpBuf, {
        contentType: "image/webp",
        upsert: true,
        duplex: "half",
      });

    if (upErr) {
      console.log(`${prefix} — upload failed: ${upErr.message}`);
      failed++;
      continue;
    }

    // Update size in DB
    await sb.from("media").update({ size: webpBuf.length }).eq("id", row.id);

    const saved = original.length - webpBuf.length;
    savedBytes += saved;
    compressed++;
    console.log(
      `${prefix} — ${(original.length / 1024).toFixed(0)} KB → ${(webpBuf.length / 1024).toFixed(0)} KB  (-${(saved / 1024).toFixed(0)} KB, -${Math.round((saved / original.length) * 100)}%)`
    );
  }

  console.log(`
─────────────────────────────
Done.
  Compressed : ${compressed}
  Skipped    : ${skipped}
  Failed     : ${failed}
  Space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB
─────────────────────────────`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
