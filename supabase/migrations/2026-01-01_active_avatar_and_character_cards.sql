alter table public.profiles add column if not exists current_avatar_id uuid references public.avatars(id);

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_update_active_avatar') then
    create policy "profiles_update_active_avatar"
      on public.profiles for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

create table if not exists public.character_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  avatar_id uuid not null references public.avatars(id) on delete cascade,
  name text,
  base_type text,
  kingdom text,
  backstory text,
  powers text[],
  traits text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, avatar_id)
);

drop trigger if exists trg_character_cards_updated_at on public.character_cards;
create trigger trg_character_cards_updated_at
  before update on public.character_cards
  for each row execute function public.set_updated_at();

alter table public.character_cards enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'character_cards_rw_own') then
    create policy "character_cards_rw_own"
      on public.character_cards for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
