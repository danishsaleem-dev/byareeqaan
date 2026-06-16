# By Areeqaan — Admin CMS

A self-contained admin dashboard at **`/admin`**, backed by **Supabase** (Postgres + Storage).

## One-time setup

1. **Create a Supabase project** (supabase.com → New project).

2. **Run the schema.** In the Supabase dashboard → SQL Editor → paste the
   contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This
   creates the tables and the public `media` storage bucket.

3. **Add environment variables.** Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...        # Settings → API → Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Settings → API → anon public key
   SUPABASE_SERVICE_ROLE_KEY=...       # Settings → API → service_role (SECRET)
   ADMIN_PASSWORD=your-admin-password  # password to log into /admin
   ADMIN_SESSION_SECRET=long-random-string
   ```

4. **Restart** the dev server (`npm run dev`) and visit **`/admin`**.

Until `.env.local` is filled in, `/admin` shows a setup notice (and the default
login password is `admin`).

## What's included

| Area | Features |
| --- | --- |
| **Dashboard** | Stats (products, published, collections), recent products, quick actions |
| **Products** | List with image/price/status/featured, live search, status filter, inline publish/draft/archive, delete, full create/edit form |
| **Product form** | Name, material, SKU, descriptions, price/compare/weight; multi-image upload with primary + remove; video upload; variants (title/SKU/price/stock/available); SEO title + meta with char-count warnings + auto-generate; slug with auto-generate; status + featured; multi-collection assign with search + inline create |
| **Collections** | Grid view, create/edit modal, image upload, auto-slug, delete |
| **Media library** | Grid/list views, type filter, search, drag-and-drop upload, detail sidebar (preview, copy URL, open, delete) |
| **Homepage editor** | Announcement bar, hero (slideshow images + copy + CTA), features strip, brand story, contact — each saves independently |
| **Site settings** | Brand (name/tagline/logo/favicon), socials, contact, policies — each group saves independently |

## Architecture

- **Data layer:** [`src/lib/data.ts`](src/lib/data.ts) — typed CRUD over Supabase.
- **Auth:** [`src/lib/auth.ts`](src/lib/auth.ts) — signed-cookie session, password gate.
- **Storage:** [`src/lib/storage.ts`](src/lib/storage.ts) — uploads to the `media` bucket.
- **Mutations:** [`src/app/admin/actions.ts`](src/app/admin/actions.ts) — server actions.
- Server Components fetch; Client Components handle interactivity (search, forms).

## Not yet wired

The **public site still renders its original hardcoded content** — it does not
yet read products/collections/homepage settings from Supabase. Connecting the
storefront to this CMS data is the natural next step.
