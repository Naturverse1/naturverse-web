-- Ensure the FK and the composite unique exist
alter table public.character_cards
  add column if not exists avatar_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'character_cards_avatar_fkey'
  ) then
    alter table public.character_cards
      add constraint character_cards_avatar_fkey
      foreign key (avatar_id) references public.avatars(id)
      on delete cascade;
  end if;
end $$;

create unique index if not exists character_cards_user_avatar_uidx
  on public.character_cards (user_id, avatar_id);

-- RLS example (adjust if already present)
alter table public.avatars enable row level security;
alter table public.character_cards enable row level security;

create policy if not exists "avatars are owner readable"
  on public.avatars for select using (user_id = auth.uid());

create policy if not exists "avatars are owner writable"
  on public.avatars for insert with check (user_id = auth.uid());

create policy if not exists "avatars are owner updatable"
  on public.avatars for update using (user_id = auth.uid());

create policy if not exists "cards are owner readable"
  on public.character_cards for select using (user_id = auth.uid());

create policy if not exists "cards are owner upsertable"
  on public.character_cards for insert with check (user_id = auth.uid());

create policy if not exists "cards are owner updatable"
  on public.character_cards for update using (user_id = auth.uid());
