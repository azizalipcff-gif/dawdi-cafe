-- ============================================================
-- DAWDI CAFE — Product publication / moderation
-- Run this in the Supabase SQL Editor to apply to an EXISTING database.
-- (supabase/schema.sql already contains these changes for fresh installs.)
-- ============================================================

-- 1. Add the publication status column (nullable first so existing rows are not
--    forced to a default yet).
alter table public.products
  add column if not exists status text;

-- 2. Backfill existing rows to 'published' so currently-live products stay
--    visible. (Before this migration there was no status concept, so every
--    existing product was effectively public.)
update public.products set status = 'published' where status is null;

-- 3. New inserts default to 'pending' (NON-public) so nothing goes live without
--    an explicit approval step, per the moderation workflow.
alter table public.products alter column status set default 'pending';

-- 4. Constrain and enforce NOT NULL now that every row has a value.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_status_check'
  ) then
    alter table public.products
      add constraint products_status_check
      check (status in ('draft', 'pending', 'published', 'rejected', 'archived'));
  end if;
end $$;

alter table public.products alter column status set not null;

-- 5. Index for the public visibility filter.
create index if not exists products_status_idx on public.products(status);

-- 6. Enforce public visibility at the database layer: anonymous / anon-key
--    readers may only fetch products whose status is 'published'. Admins use
--    the service-role key, which bypasses RLS, so they keep full access.
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (status = 'published');
