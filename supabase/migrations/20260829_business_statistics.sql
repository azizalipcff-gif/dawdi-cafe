-- ============================================================
-- DAWDI CAFE — `business_statistics` table (idempotent)
-- ------------------------------------------------------------
-- Stores admin-configurable business statistics displayed on the
-- public site. Public readers may only select rows where
-- `is_active` = true.
-- ============================================================

create table if not exists public.business_statistics (
  id           uuid primary key default gen_random_uuid(),
  key          text not null unique,
  label        text not null,
  value        text,
  description  text,
  use_real_count boolean not null default false,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.business_statistics enable row level security;

-- Public can read only active statistics
drop policy if exists "business_statistics_select_public" on public.business_statistics;
create policy "business_statistics_select_public"
  on public.business_statistics for select
  using (is_active);

-- Only admins can write statistics
drop policy if exists "business_statistics_write_admin" on public.business_statistics;
create policy "business_statistics_write_admin"
  on public.business_statistics for all
  using (public.is_admin())
  with check (public.is_admin());

-- Keep updated_at in sync on UPDATE
drop trigger if exists trg_business_statistics_updated_at on public.business_statistics;
create trigger trg_business_statistics_updated_at
  before update on public.business_statistics
  for each row execute function public.set_updated_at();
