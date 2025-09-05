-- Enable row level security for avatars table and allow users to manage their own rows
alter table public.avatars enable row level security;

-- Select own rows
create policy "avatars_select_own"
on public.avatars for select
  to authenticated
  using (user_id = auth.uid());

-- Insert own rows
create policy "avatars_insert_own"
on public.avatars for insert
  to authenticated
  with check (user_id = auth.uid());

-- Update own rows
create policy "avatars_update_own"
on public.avatars for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Public read (optional)
-- create policy "avatars_read_public"
-- on public.avatars for select
--   to anon
--   using (true);
