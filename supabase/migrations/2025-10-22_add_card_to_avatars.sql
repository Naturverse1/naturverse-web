-- Add JSONB column to store character card on each avatar
alter table public.avatars
add column if not exists card jsonb default '{}'::jsonb;

-- RLS: allow owners to update their own avatar.card
-- (Idempotent policies: create only if not exists)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='avatars' and policyname='avatars_update_own_card'
  ) then
    create policy "avatars_update_own_card"
      on public.avatars
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;
