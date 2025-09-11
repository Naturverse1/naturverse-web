-- One primary avatar per user
create unique index if not exists unique_primary_avatar_per_user
on public.avatars (user_id) where is_primary = true;

-- Ensure character_cards belongs to a single user; enable ON CONFLICT (user_id)
alter table public.character_cards
  add column if not exists avatar_id uuid,
  add constraint character_cards_user_unique unique (user_id);

-- FK to avatars (optional but recommended)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'character_cards_avatar_fkey'
  ) then
    alter table public.character_cards
      add constraint character_cards_avatar_fkey
      foreign key (avatar_id) references public.avatars(id)
      on delete set null;
  end if;
end $$;

-- RLS policies (idempotent)
-- Avatars: read public or own; write own
create policy if not exists "read public or own avatars"
on public.avatars for select
using (is_public = true or auth.uid() = user_id);

create policy if not exists "insert own avatars"
on public.avatars for insert
with check (auth.uid() = user_id);

create policy if not exists "update own avatars"
on public.avatars for update
using (auth.uid() = user_id);

-- Character cards: user can manage own
create policy if not exists "manage own character_card select"
on public.character_cards for select
using (auth.uid() = user_id);

create policy if not exists "manage own character_card insert"
on public.character_cards for insert
with check (auth.uid() = user_id);

create policy if not exists "manage own character_card update"
on public.character_cards for update
using (auth.uid() = user_id);
