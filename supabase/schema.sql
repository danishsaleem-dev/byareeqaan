-- ============================================================
--  By Areeqaan — admin CMS schema
--  Run this in the Supabase SQL editor (one time).
-- ============================================================

-- Products ----------------------------------------------------
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  material       text default '',
  sku            text default '',
  short_desc     text default '',
  full_desc      text default '',
  price          numeric default 0,
  compare_price  numeric,
  weight         numeric,
  slug           text unique not null,
  status         text not null default 'draft' check (status in ('published','draft','archived')),
  featured       boolean not null default false,
  seo_title      text default '',
  seo_desc       text default '',
  images         jsonb not null default '[]'::jsonb,
  videos         jsonb not null default '[]'::jsonb,
  variants       jsonb not null default '[]'::jsonb,
  collection_ids jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_status_idx  on products (status);
create index if not exists products_created_idx on products (created_at desc);

-- Collections -------------------------------------------------
create table if not exists collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text default '',
  image_url   text default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Media library ----------------------------------------------
create table if not exists media (
  id         uuid primary key default gen_random_uuid(),
  filename   text not null,
  url        text not null,
  path       text default '',
  type       text not null default 'image' check (type in ('image','video')),
  size       bigint default 0,
  created_at timestamptz not null default now()
);
create index if not exists media_created_idx on media (created_at desc);

-- Key/value settings (homepage + site config) ----------------
create table if not exists settings (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);

-- Storage bucket for uploads ---------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ------------------------------------------------------------
--  Row Level Security
--  The admin uses the service-role key (bypasses RLS). These
--  policies let the PUBLIC site read content with the anon key.
-- ------------------------------------------------------------
alter table products    enable row level security;
alter table collections enable row level security;
alter table media       enable row level security;
alter table settings    enable row level security;

drop policy if exists "public read published products" on products;
create policy "public read published products" on products
  for select using (status = 'published');

drop policy if exists "public read collections" on collections;
create policy "public read collections" on collections for select using (true);

drop policy if exists "public read media" on media;
create policy "public read media" on media for select using (true);

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);

-- Public read for the media storage bucket
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');
