-- ============================================================
-- DAWDI CAFE — tighten public INSERT RLS (idempotent)
-- ------------------------------------------------------------
-- The public INSERT policies for reservations, orders and messages
-- previously used `with check (true)`, which let a caller using the
-- public anon key write privileged columns directly via PostgREST
-- (e.g. a reservation/order with status = 'accepted'/'completed', or
-- a message with is_read/is_replied/is_archived = true). The app
-- server actions already enforce the safe defaults, but RLS should
-- enforce the invariant at the database layer too. This migration
-- tightens the three public INSERT policies so the privileged
-- columns can only hold their safe default values on insert.
-- Safe to run multiple times (DROP POLICY IF EXISTS / CREATE).
-- ============================================================

-- Reservations: public inserts may only create a 'pending' reservation.
drop policy if exists "reservations_insert_public" on public.reservations;
create policy "reservations_insert_public"
  on public.reservations for insert
  with check (status = 'pending' or status is null);

-- Orders: public inserts may only create a 'pending' order.
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
  on public.orders for insert
  with check (status = 'pending' or status is null);

-- Messages: public inserts may only create unread/unreplied/unarchived messages.
drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public"
  on public.messages for insert
  with check (
    (is_read is false or is_read is null)
    and (is_replied is false or is_replied is null)
    and (is_archived is false or is_archived is null)
  );
