-- Phase 4: Wishlist
-- Run in Supabase SQL Editor.

create table if not exists wishlists (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table wishlists enable row level security;

create policy "user manages own wishlist" on wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
