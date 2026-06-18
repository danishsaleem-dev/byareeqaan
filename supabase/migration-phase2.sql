-- ============================================================
--  By Areeqaan — Phase 2 migration (customer accounts)
--  Run once in the Supabase SQL editor. Safe to re-run.
--
--  ALSO (one-time, in the Supabase dashboard):
--   Authentication → URL Configuration → add Redirect URLs:
--     http://localhost:3001/auth/callback
--     https://<your-domain>/auth/callback
--     https://<your-vercel-url>/auth/callback
--   (Default email templates work as-is — no template edits needed.)
-- ============================================================

-- Customer profile (1:1 with auth.users) ---------------------
create table if not exists profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text default '',
  phone      text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "own profile select" on profiles;
create policy "own profile select" on profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile insert" on profiles;
create policy "own profile insert" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "own profile update" on profiles;
create policy "own profile update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Saved addresses --------------------------------------------
create table if not exists addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  full_name  text default '',
  phone      text default '',
  address    text default '',
  city       text default '',
  country    text default 'Pakistan',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on addresses (user_id);

alter table addresses enable row level security;

drop policy if exists "own addresses" on addresses;
create policy "own addresses" on addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row when a user signs up -------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
