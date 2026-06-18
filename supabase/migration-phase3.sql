-- Phase 3: Orders
-- Run this in the Supabase SQL Editor.

create table if not exists orders (
  id                      uuid        primary key default gen_random_uuid(),
  order_number            text        unique not null default '',
  user_id                 uuid        references auth.users(id) on delete set null,

  -- Customer snapshot (works for guests too)
  email                   text        not null,
  full_name               text        not null,
  phone                   text        not null,
  address                 text        not null,
  city                    text        not null,
  country                 text        not null default 'Pakistan',

  -- Items + totals
  items                   jsonb       not null default '[]',
  subtotal                numeric     not null,

  -- Payment
  payment_method          text        not null,  -- faisal_bank | nayapay | easypaisa
  payment_screenshot_url  text,

  -- Status flow: pending_payment → payment_review → confirmed → packed → shipped → delivered
  -- Also: cancelled
  status                  text        not null default 'pending_payment',
  admin_notes             text,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Auto-generate order numbers: BA-YYYYMMDD-XXXX
create sequence if not exists order_seq start 1000;

create or replace function set_order_number()
returns trigger language plpgsql as $$
begin
  new.order_number := 'BA-' || to_char(now(), 'YYYYMMDD') || '-' ||
                      lpad(nextval('order_seq')::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists trg_order_number on orders;
create trigger trg_order_number
  before insert on orders
  for each row when (new.order_number = '')
  execute function set_order_number();

-- Auto-update updated_at
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function touch_updated_at();

-- Row Level Security
alter table orders enable row level security;

-- Signed-in customers can read their own orders
create policy "customer select own" on orders
  for select using (auth.uid() = user_id);

-- Anyone (including guests) can place an order
create policy "anyone can insert" on orders
  for insert with check (true);
