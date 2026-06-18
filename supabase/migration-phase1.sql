-- ============================================================
--  By Areeqaan — Phase 1 migration (orders foundations)
--  Run this once in the Supabase SQL editor.
--  Safe to re-run (idempotent).
-- ============================================================

-- Product economics + availability ---------------------------
alter table products add column if not exists cost  numeric;          -- admin-only cost price (for profit)
alter table products add column if not exists stock integer;          -- null = not tracked / made to order
alter table products add column if not exists sold  boolean not null default false; -- one-tap "Sold" flag
