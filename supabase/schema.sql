-- ============================================================
-- DAWDI CAFE — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- UPDATED_AT TRIGGER (shared by all tables)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- ROLES / PERMISSION HELPER FUNCTIONS
-- ============================================================

-- Current admin role for the authenticated user (or null)
create or replace function public.admin_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.admins where user_id = auth.uid() limit 1;
$$;

-- Is the authenticated user an admin at all?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Does the authenticated user hold one of the allowed roles?
create or replace function public.has_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and role = any(allowed_roles)
  );
$$;

-- ============================================================
-- TABLE: PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- ============================================================
-- TABLE: ADMINS
-- ============================================================
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  role          text not null default 'employee'
                check (role in ('super_admin', 'manager', 'employee')),
  is_suspended  boolean not null default false,
  permissions   jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Column additions for databases created before these fields existed.
alter table public.admins add column if not exists is_suspended boolean not null default false;
alter table public.admins add column if not exists permissions jsonb not null default '{}'::jsonb;

alter table public.admins enable row level security;

-- Only admins can read the admins table
create policy "admins_select"
  on public.admins for select
  using (public.is_admin());

-- Only super admins can write the admins table
create policy "admins_insert_super"
  on public.admins for insert
  with check (public.has_role(array['super_admin']));

create policy "admins_update_super"
  on public.admins for update
  using (public.has_role(array['super_admin']));

create policy "admins_delete_super"
  on public.admins for delete
  using (public.has_role(array['super_admin']));

-- ============================================================
-- TABLE: SETTINGS (key / value store)
-- ============================================================
create table if not exists public.settings (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  value       jsonb not null default '{}'::jsonb,
  value_fr    jsonb not null default '{}'::jsonb,
  value_ar    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.settings add column if not exists value_fr jsonb not null default '{}'::jsonb;
alter table public.settings add column if not exists value_ar jsonb not null default '{}'::jsonb;

alter table public.settings enable row level security;

-- Public can read settings (needed for the public site)
create policy "settings_select_public"
  on public.settings for select
  using (true);

-- Only admins can write settings
create policy "settings_write_admin"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  translations jsonb not null default '{}'::jsonb,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.categories enable row level security;

create policy "categories_select_public"
  on public.categories for select
  using (true);

create policy "categories_write_admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: PRODUCTS
-- ============================================================
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.categories(id) on delete set null,
  name         text not null,
  description  text,
  price        numeric(10,2) not null default 0 check (price >= 0),
  discount     numeric(10,2) not null default 0 check (discount >= 0),
  ingredients  jsonb not null default '[]'::jsonb,
  image_url    text,
  is_available boolean not null default true,
  is_featured  boolean not null default false,
  is_recommended boolean not null default false,
  translations jsonb not null default '{}'::jsonb,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.products add column if not exists discount numeric(10,2) not null default 0 check (discount >= 0);
alter table public.products add column if not exists ingredients jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists is_recommended boolean not null default false;
alter table public.products add column if not exists translations jsonb not null default '{}'::jsonb;

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(is_featured);
create index if not exists products_recommended_idx on public.products(is_recommended);

alter table public.products enable row level security;

create policy "products_select_public"
  on public.products for select
  using (true);

create policy "products_write_admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: GALLERY
-- ============================================================
create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  description text,
  image_url   text not null,
  category    text,
  translations jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.gallery add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.gallery add column if not exists is_featured boolean not null default false;

alter table public.gallery enable row level security;

create policy "gallery_select_public"
  on public.gallery for select
  using (true);

create policy "gallery_write_admin"
  on public.gallery for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: RESERVATIONS
-- ============================================================
create table if not exists public.reservations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  guests     integer not null default 1 check (guests >= 1),
  date       date not null,
  time       time not null,
  notes      text,
  status     text not null default 'pending'
             check (status in ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

-- Anyone can create a reservation
create policy "reservations_insert_public"
  on public.reservations for insert
  with check (true);

-- Only admins can read / update / delete reservations
create policy "reservations_read_admin"
  on public.reservations for select
  using (public.is_admin());

create policy "reservations_update_admin"
  on public.reservations for update
  using (public.is_admin());

create policy "reservations_delete_admin"
  on public.reservations for delete
  using (public.is_admin());

-- ============================================================
-- TABLE: ORDERS
-- ============================================================
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  items         jsonb not null default '[]'::jsonb,
  total         numeric(10,2) not null default 0 check (total >= 0),
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

alter table public.orders enable row level security;

-- Anyone can place an order
create policy "orders_insert_public"
  on public.orders for insert
  with check (true);

-- Only admins can read / update / delete orders
create policy "orders_read_admin"
  on public.orders for select
  using (public.is_admin());

create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin());

create policy "orders_delete_admin"
  on public.orders for delete
  using (public.is_admin());

-- ============================================================
-- TABLE: MESSAGES
-- ============================================================
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  is_read     boolean not null default false,
  is_replied  boolean not null default false,
  is_archived boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.messages add column if not exists is_replied boolean not null default false;
alter table public.messages add column if not exists is_archived boolean not null default false;

alter table public.messages enable row level security;

-- Anyone can send a message
create policy "messages_insert_public"
  on public.messages for insert
  with check (true);

-- Only admins can read / update / delete messages
create policy "messages_read_admin"
  on public.messages for select
  using (public.is_admin());

create policy "messages_update_admin"
  on public.messages for update
  using (public.is_admin());

create policy "messages_delete_admin"
  on public.messages for delete
  using (public.is_admin());

-- ============================================================
-- TABLE: TESTIMONIALS (public reviews shown on the site)
-- ============================================================
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  rating     integer not null default 5 check (rating between 1 and 5),
  content    text not null,
  translations jsonb not null default '{}'::jsonb,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.testimonials enable row level security;

create policy "testimonials_select_public"
  on public.testimonials for select
  using (true);

create policy "testimonials_write_admin"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: HERO SLIDES (homepage carousel slides)
-- ============================================================
create table if not exists public.hero_slides (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  subtitle       text,
  image_url      text not null,
  button_label   text,
  button_url     text,
  overlay_opacity integer not null default 40 check (overlay_opacity between 0 and 100),
  translations   jsonb not null default '{}'::jsonb,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

create policy "hero_slides_select_public"
  on public.hero_slides for select
  using (true);

create policy "hero_slides_write_admin"
  on public.hero_slides for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- TABLE: ALBUMS (gallery grouping)
-- ============================================================
create table if not exists public.albums (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  cover_url     text,
  translations  jsonb not null default '{}'::jsonb,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.albums enable row level security;

create policy "albums_select_public"
  on public.albums for select
  using (true);

create policy "albums_write_admin"
  on public.albums for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_admins_updated_at before update on public.admins
  for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();
create trigger trg_categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_gallery_updated_at before update on public.gallery
  for each row execute function public.set_updated_at();
create trigger trg_reservations_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger trg_messages_updated_at before update on public.messages
  for each row execute function public.set_updated_at();
create trigger trg_testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();
create trigger trg_hero_slides_updated_at before update on public.hero_slides
  for each row execute function public.set_updated_at();
create trigger trg_albums_updated_at before update on public.albums
  for each row execute function public.set_updated_at();

-- ============================================================
-- AUTO-PROFILE on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- INITIAL SETTINGS SEED
-- ============================================================
insert into public.settings (key, value) values
  ('cafe', jsonb_build_object(
    'name', 'DAWDI CAFE',
    'tagline', 'Coffee for the Road',
    'description', 'Premium coffee, crêpes, snacks and quality drinks in Morocco.',
    'logo_url', '/logo/logo.png',
    'favicon', '/logo/logo.png',
    'hero_image', '/logo/logo.png'
  )),
  ('contact', jsonb_build_object(
    'phone', '+212 656480972',
    'whatsapp', '212656480972',
    'email', 'contact@dawdicafe.com',
    'instagram', 'https://www.instagram.com/cafe_dawdi/',
    'facebook', 'https://www.facebook.com/',
    'tiktok', 'https://www.tiktok.com/',
    'maps_url', 'https://maps.app.goo.gl/z2hZuQ2UtCsZoZDGA',
    'address', 'Morocco'
  )),
  ('hours', jsonb_build_object(
    'weekdays', '8:00 AM - 11:00 PM',
    'weekends', '9:00 AM - 12:00 AM'
  )),
  ('seo', jsonb_build_object(
    'title', 'DAWDI CAFE — Coffee for the Road',
    'description', 'Premium coffee, crêpes, snacks and quality drinks in Morocco.',
    'keywords', 'coffee, cafe, morocco, crêpes, dawdi, coffee shop, maroc',
    'og_image', '/logo/logo.png'
  )),
  ('design', jsonb_build_object(
    'primary_color', '#ff6b00'
  )),
  ('footer', jsonb_build_object(
    'about', 'Premium coffee, crêpes, snacks and quality drinks. Fresh, fast, and friendly service in Morocco.',
    'copyright', '© {year} DAWDI CAFE. All rights reserved.'
  ))
on conflict (key) do nothing;

-- ============================================================
-- INITIAL HERO SLIDES SEED
-- ============================================================
insert into public.hero_slides (title, subtitle, image_url, button_label, button_url, overlay_opacity, sort_order) values
  ('Coffee for the Road', 'Premium coffee, crêpes, snacks and quality drinks in Morocco.',
   '/logo/logo.png', 'Explore the Menu', '/menu', 40, 1)
on conflict (id) do nothing;

-- ============================================================
-- INITIAL ALBUMS SEED
-- ============================================================
insert into public.albums (name, slug, description, sort_order) values
  ('Our Cafe', 'our-cafe', 'Inside DAWDI CAFE', 1),
  ('Signature Drinks', 'signature-drinks', 'Handcrafted beverages', 2)
on conflict (slug) do nothing;

-- ============================================================
-- INITIAL CATEGORIES SEED
-- ============================================================
insert into public.categories (name, slug, description, sort_order) values
  ('Espresso', 'espresso', 'Rich and bold espresso drinks', 1),
  ('Cappuccino', 'cappuccino', 'Classic cappuccino favourites', 2),
  ('Latte', 'latte', 'Smooth and creamy lattes', 3),
  ('American Coffee', 'american-coffee', 'Simple and honest American coffee', 4),
  ('Tea', 'tea', 'Fresh and aromatic teas', 5),
  ('Fresh Juice', 'fresh-juice', 'Freshly squeezed juices', 6),
  ('Milkshake', 'milkshake', 'Thick and creamy milkshakes', 7),
  ('Smoothies', 'smoothies', 'Healthy fruit smoothies', 8),
  ('Crêpes', 'crepes', 'Sweet and savoury crêpes', 9),
  ('Pancakes', 'pancakes', 'Fluffy pancakes', 10),
  ('Desserts', 'desserts', 'Sweet desserts', 11)
on conflict (slug) do nothing;

-- ============================================================
-- INITIAL SUPER ADMIN SEED
-- ------------------------------------------------------------
-- The only administrator account. The auth user must be created
-- manually in Supabase Auth (Email / Password) — no password is
-- stored in this file. Run this ONCE after creating that user,
-- replacing <AUTH_USER_ID> with the id of the admin's auth user.
-- ============================================================
insert into public.admins (user_id, role)
values ('<AUTH_USER_ID>', 'super_admin')
on conflict (user_id) do update set role = 'super_admin';
