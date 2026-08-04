-- ============================================================
-- DAWDI CAFE — `categories` table (idempotent)
-- ------------------------------------------------------------
-- Creates the public.categories table if it does not exist and
-- adds two RLS policies: public read, admin write. The app hooks
-- into admin writes through the `public.is_admin()` helper (the
-- authenticated admin), not the service_role — in Supabase the
-- service_role key bypasses RLS entirely, so no policy is needed
-- for it. Safe to run multiple times (IF NOT EXISTS / DROP ... IF
-- EXISTS / OR REPLACE).
-- ============================================================

-- Ensure the shared updated_at helper exists (idempotent).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  image_url    text,
  translations jsonb not null default '{}'::jsonb,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Public can read categories (needed for the public site)
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories for select
  using (true);

-- Only admins can write categories
drop policy if exists "categories_write_admin" on public.categories;
create policy "categories_write_admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Keep updated_at in sync on UPDATE
drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();