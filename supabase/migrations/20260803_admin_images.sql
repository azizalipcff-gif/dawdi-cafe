-- ============================================================
-- DAWDI CAFE — Admin image uploads (Supabase Storage)
-- Run in the Supabase SQL Editor. Creates a public `images` bucket
-- and RLS policies so only admins can upload/delete while the
-- public site can read them.
-- ============================================================

-- Public bucket for product / gallery / hero / branding images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  8388608, -- 8 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read for the site
drop policy if exists "images_public_select" on storage.objects;
create policy "images_public_select"
  on storage.objects for select
  using (bucket_id = 'images');

-- Admins may insert images (guarded by the SQL admins table)
drop policy if exists "images_admin_insert" on storage.objects;
create policy "images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'images' and public.is_admin());

-- Admins may overwrite images
drop policy if exists "images_admin_update" on storage.objects;
create policy "images_admin_update"
  on storage.objects for update
  using (bucket_id = 'images' and public.is_admin());

-- Admins may delete images
drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'images' and public.is_admin());
